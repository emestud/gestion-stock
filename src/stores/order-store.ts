import { supabase, getOrderByID, getWasteByID, getLastModificationOfOrder, 
        getOrdersByDate, getAllOriginalOrders, getWastesByDate, getAllWastes } from "../databaseClient";

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
        if (lastModification !== null && lastModification.length > 0) {
          lastModificationOrder = lastModification[0];
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
      let data: any;
      if (date !== null) {

          let orders = await getOrdersByDate(date);
          
          if (orders !== null) {
            orders.filter((order)=>{
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
      let data: any;
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


  public async getModifiedOrders(orders: Array<any>) {
    let ordersTuples:Array<any> = [];

    for (const order of orders) {

      let modifiedOrder = await getLastModificationOfOrder(order.id);

      if (modifiedOrder === null || modifiedOrder.length === 0) {
        ordersTuples.push([order, order]); // we push the exact same order if the order hasnt been modified
      }
      else {
        ordersTuples.push([order, modifiedOrder[0]]);
      }

    }    
    return ordersTuples;
  }

  public async prepareOrders(orders: any[]) {
    const orderItems = new Array();

    for (const order of orders) {
      let {data: products} = await supabase
        .from("order-item-container")
        .select("*")
        .eq("order_id", order.id);
        //.eq("canceled_by_lab", false);

      let {data: restaurant} = await supabase
        .from("restaurant")
        .select("name, address")
        .eq("id", order.restaurant_id);

      orderItems.push({
        items: products,
        restaurant: (restaurant !== null) ? restaurant[0] : {},
      });

    }

    let newItems: Array<any> = [];

    for (const orderItem of orderItems) {
      for (const item of orderItem.items) {
        let {data: container} = await supabase
          .from("container")
          .select("name")
          .eq("id", item.container_id);

        let {data: itemFromDB} = await supabase
          .from("item")
          .select("name, category, priority")
          .eq("id", item.item_id);

        if (container !== null && itemFromDB != null) {
          let newItem = {
            id: item.id,
            orderID: item.order_id,
            restaurant_name: orderItem.restaurant.name,
            itemName: itemFromDB[0].name,
            itemCategory: itemFromDB[0].category,
            priority: itemFromDB[0].priority,
            containerName: container[0].name,
            quantity: item.quantity,
            canceled_by_lab: item.canceled_by_lab,
          };

          newItems.push(newItem);
        }
      }
    }

    return newItems.sort((a:any, b:any)=>{
      return a.priority - b.priority
    });
  }

  public gatherItemsForLab(items: Array<any>) {

    let restaurants:Array<string> = []
    for (const item of items) {
      if(!restaurants.includes(item.restaurant_name)) {
        restaurants.push(item.restaurant_name);
      }
    }

    let itemsForEachRestaurant: Array<any> = []; 
    let itemsProcessed: Array<string> = [];
    
    for (const item of items) {
      if (!itemsProcessed.includes(item.itemName)) {

        let quantities:Array<any> = [];
        let containers: Array<any> = [];
        
        for (const itemToFind of items) {
          if (itemToFind.itemName === item.itemName) {
            quantities.push({
              item_order_id: itemToFind.id,
              quantity: itemToFind.quantity,
              restaurant: itemToFind.restaurant_name
            });
            containers.push({
              item_order_id: itemToFind.id,
              container: itemToFind.containerName,
              restaurant: itemToFind.restaurant_name
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
              quantity: 0,
              restaurant: restaurant
            });
            containers.push({
              container: "Aucun",
              restaurant: restaurant
            });
          }
        }

        itemsForEachRestaurant.push({
          canceled_by_lab: item.canceled_by_lab,
          name: item.itemName,
          quantities: quantities,
          containers: containers,
          priority: item.priority
        });
      }

      itemsProcessed.push(item.itemName);
    }

    return itemsForEachRestaurant;

  }
}

