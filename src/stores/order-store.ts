import {
  getOrderByID,
  getWasteByID,
  getLastModificationOfOrder,
  getOrdersByDate,
  getAllOriginalOrders,
  getWastesByDate,
  getAllWastes,
  getRestaurantData,
  get3TupleFromOrder,
  getContainerNameByID,
  getItemByID,
} from '../databaseClient';
import {LabItemInfo, Order, OrderTuple, Waste, ItemWithLabInfo} from '../types';

export class OrderStore {
  /**
   * This function fetchs an returns an order from the DB
   * @param orderID number representing the order ID
   */
  async getOrder(orderID: string, mode = 'Order') {
    let order = null;
    let lastModification = null;

    if (mode === 'Order') {
      order = await getOrderByID(orderID);
      lastModification = await getLastModificationOfOrder(orderID);
    } else {
      order = await getWasteByID(orderID);
    }

    let originalOrder = null;
    let lastModificationOrder = null;

    if (order !== null) {
      originalOrder = order;
      if (lastModification !== null) {
        lastModificationOrder = lastModification;
      } else {
        lastModificationOrder = originalOrder;
      }
    }
    return [originalOrder, lastModificationOrder];
  }

  public async getOrders(date: string | null) {
    const orders: Array<Order> = [];

    try {
      let data: Array<Order> | null;
      if (date !== null) {
        let orders = await getOrdersByDate(date);

        if (orders !== null) {
          orders = orders.filter(order => {
            return order.original_order === null;
          });
        }
        data = orders;
      } else {
        data = await getAllOriginalOrders();
      }

      if (data?.length !== 0 && data !== null) {
        orders.push(...data);
        orders.sort((a: Order, b: Order) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB.getTime() - dateA.getTime();
        });
      }
    } catch (err) {
      console.log(err);
    }

    return orders;
  }

  public async getWastes(date: string | null) {
    const wastes: Array<Waste> = [];

    try {
      let data: Array<Waste> | null;
      if (date !== null) {
        data = await getWastesByDate(date);
      } else {
        data = await getAllWastes();
      }

      if (data?.length !== 0 && data !== null) {
        wastes.push(...data);
        wastes.sort((a: Waste, b: Waste) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB.getTime() - dateA.getTime();
        });
      }
    } catch (err) {
      console.log(err);
    }

    return wastes;
  }

  public async getModifiedOrders(orders: Array<Order>) {
    const ordersTuples: Array<OrderTuple> = [];

    for (const order of orders) {
      const modifiedOrder = await getLastModificationOfOrder(order.id);

      if (modifiedOrder === null || modifiedOrder.length === 0) {
        ordersTuples.push({
          originalOrder: order,
          modifiedOrder: order,
        }); // we push the exact same order if the order hasnt been modified
      } else {
        ordersTuples.push({
          originalOrder: order,
          modifiedOrder: modifiedOrder,
        });
      }
    }
    return ordersTuples;
  }

  public async prepareOrders(orders: Order[]) {
    const orderItems = [];

    let originalOrderID = '';

    for (const order of orders) {
      if (order.original_order) {
        originalOrderID = order.original_order;
      }

      const products = await get3TupleFromOrder(order.id);

      const restaurant = await getRestaurantData(order.restaurant_id);

      orderItems.push({
        items: products,
        restaurant: restaurant !== null ? restaurant : {},
      });
    }

    const newItems: Array<ItemWithLabInfo> = [];

    for (const orderItem of orderItems) {
      for (const item of orderItem.items) {
        const container: string = await getContainerNameByID(item.container_id);

        const itemFromDB = await getItemByID(item.item_id);

        if (container !== null && itemFromDB !== null) {
          const newItem = {
            id: item.id,
            orderID: originalOrderID ? originalOrderID : item.order_id,
            restaurant: orderItem.restaurant.name,
            name: itemFromDB.name,
            itemCategory: itemFromDB.category,
            labPriority: itemFromDB.labPriority,
            container: container,
            quantity: item.quantity,
            canceledByLab: item.canceled_by_lab,
          };

          newItems.push(newItem);
        }
      }
    }

    return newItems.sort((a: ItemWithLabInfo, b: ItemWithLabInfo) => {
      return a.labPriority - b.labPriority;
    });
  }

  public gatherItemsForLab(items: Array<ItemWithLabInfo>) {
    const restaurants: Array<string> = [];
    for (const item of items) {
      if (!restaurants.includes(item.restaurant)) {
        restaurants.push(item.restaurant);
      }
    }

    const itemsForEachRestaurant: Array<any> = [];
    const itemsProcessed: Array<string> = [];

    for (const item of items) {
      if (!itemsProcessed.includes(item.name)) {
        const quantities: Array<LabItemInfo> = [];
        const containers: Array<LabItemInfo> = [];

        for (const itemToFind of items) {
          if (itemToFind.name === item.name) {
            quantities.push({
              item_order_id: itemToFind.id,
              quantity: itemToFind.quantity,
              restaurant: itemToFind.restaurant,
            });
            containers.push({
              item_order_id: itemToFind.id,
              container: itemToFind.container,
              restaurant: itemToFind.restaurant,
            });
          }
        }

        for (const restaurant of restaurants) {
          let isInArray = false;
          for (const quantity of quantities) {
            if (quantity.restaurant === restaurant) {
              isInArray = true;
            }
          }
          if (!isInArray) {
            quantities.push({
              item_order_id: '',
              quantity: 0,
              restaurant: restaurant,
            });
            containers.push({
              item_order_id: '',
              container: 'Aucun',
              restaurant: restaurant,
            });
          }
        }

        itemsForEachRestaurant.push({
          canceled_by_lab: item.canceledByLab,
          name: item.name,
          quantities: quantities,
          containers: containers,
          labPriority: item.labPriority,
        });
      }

      itemsProcessed.push(item.name);
    }

    return itemsForEachRestaurant;
  }
}
