import { getOrderByID, getWasteByID, getLastModificationOfOrder, 
        getOrdersByDate, getAllOriginalOrders, getWastesByDate, getAllWastes, getRestaurantData, get3TupleFromOrder, getContainerNameByID, getItemByID } from "../databaseClient";
import { LabItemInfo, Order, OrderTuple, Waste, ItemWithLabInfo } from "../types";

export class OrderStore {

    /**
     * This function fetchs an returns an order from the DB
     * @param orderID number representing the order ID
     */
   async getOrder(orderID: string, mode: string = "Order"){

      let order = null;
      let lastModification = null;

      if (mode === "Order") {
        order = await getOrderByID(orderID);
        lastModification = await getLastModificationOfOrder(orderID);
      }
      else {
        order = await getWasteByID(orderID);
      }

      let originalOrder = null;
      let lastModificationOrder = null;

      if (order !== null) {
        originalOrder = order;
        if (lastModification !== null) {
          lastModificationOrder = lastModification;
        }
        else {
          lastModificationOrder = originalOrder
        }

      }
      return [originalOrder, lastModificationOrder];
    }

  public async getOrders(date: string | null) {
    const orders = new Array();

    try {
      let data: Array<Order> | null;
      if (date !== null) {

          let orders = await getOrdersByDate(date);
          
          if (orders !== null) {
            orders = orders.filter((order)=>{
              return order.original_order === null;
            })
          }
          data = orders;
      }
      else {
          data = await getAllOriginalOrders();
      }

      if (data?.length !== 0 && data !== null) {
        orders.push(...data);
        orders.sort((a:any, b:any)=>{
          let dateA = new Date(a.created_at);
          let dateB = new Date(b.created_at);
          return dateB.getTime() - dateA.getTime();
        })
      }
    } catch (err) {
      console.log(err);
    }

    return orders;
  }


  public async getWastes(date: string | null) {
    const wastes = new Array();

    try {
      let data: Array<Waste> | null;
      if (date !== null) {
          data = await getWastesByDate(date);
      }
      else {
          data = await getAllWastes();
      }

      if (data?.length !== 0 && data !== null) {
        wastes.push(...data);
        wastes.sort((a:any, b:any)=>{
          let dateA = new Date(a.created_at);
          let dateB = new Date(b.created_at);
          return dateB.getTime() - dateA.getTime();
        })
      }
    } catch (err) {
      console.log(err);
    }

    return wastes;
  }


  public async getModifiedOrders(orders: Array<Order>) {
    let ordersTuples:Array<OrderTuple> = [];

    for (const order of orders) {

      let modifiedOrder = await getLastModificationOfOrder(order.id);

      if (modifiedOrder === null || modifiedOrder.length === 0) {
        ordersTuples.push({
          originalOrder: order,
          modifiedOrder: order
        }); // we push the exact same order if the order hasnt been modified
      }
      else {
        ordersTuples.push({
          originalOrder: order, 
          modifiedOrder: modifiedOrder});
      }

    }    
    return ordersTuples;
  }

  public async prepareOrders(orders: Order[]) {

    const orderItems = new Array();

    for (const order of orders) {
      let products = await get3TupleFromOrder(order.id);

      let restaurant = await getRestaurantData(order.restaurant_id);

      orderItems.push({
        items: products,
        restaurant: (restaurant !== null) ? restaurant : {},
      });

    }

    let newItems: Array<ItemWithLabInfo> = [];

    for (const orderItem of orderItems) {
      for (const item of orderItem.items) {

        let container: string = await getContainerNameByID(item.container_id);
        
        let itemFromDB = await getItemByID(item.item_id);

        if (container !== null && itemFromDB != null) {
          let newItem = {
            id: item.id,
            orderID: item.order_id,
            restaurant: orderItem.restaurant.name,
            name: itemFromDB.name,
            itemCategory: itemFromDB.category,
            priority: itemFromDB.priority,
            container: container,
            quantity: item.quantity,
            canceledByLab: item.canceled_by_lab,
          };

          newItems.push(newItem);
        }
      }
    }

    return newItems.sort((a:any, b:any)=>{
      return a.priority - b.priority
    });
  }

  public gatherItemsForLab(items: Array<ItemWithLabInfo>) {

    let restaurants:Array<string> = []
    for (const item of items) {
      if(!restaurants.includes(item.restaurant)) {
        restaurants.push(item.restaurant);
      }
    }

    let itemsForEachRestaurant: Array<any> = []; 
    let itemsProcessed: Array<string> = [];
    
    for (const item of items) {
      if (!itemsProcessed.includes(item.name)) {

        let quantities:Array<LabItemInfo> = [];
        let containers: Array<LabItemInfo> = [];
        
        for (const itemToFind of items) {
          if (itemToFind.name === item.name) {
            quantities.push({
              item_order_id: itemToFind.id,
              quantity: itemToFind.quantity,
              restaurant: itemToFind.restaurant
            });
            containers.push({
              item_order_id: itemToFind.id,
              container: itemToFind.container,
              restaurant: itemToFind.restaurant
            });
          }
        }

        for (const restaurant of restaurants) {
          let isInArray:boolean = false;
          for (const quantity of quantities) {
            if (quantity.restaurant === restaurant) {
              isInArray = true;
            } 
          }
          if (!isInArray) {
            quantities.push({
              item_order_id: "",
              quantity: 0,
              restaurant: restaurant
            });
            containers.push({
              item_order_id: "",
              container: "Aucun",
              restaurant: restaurant
            });
          }
        }

        itemsForEachRestaurant.push({
          canceled_by_lab: item.canceledByLab,
          name: item.name,
          quantities: quantities,
          containers: containers,
          priority: item.priority
        });
      }

      itemsProcessed.push(item.name);
    }

    return itemsForEachRestaurant;

  }
}

