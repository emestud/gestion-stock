import {supabase} from "../supabaseClient";

export class OrderStore {

  public async getOrders() {
    const orders = new Array();

    try {
      let {data, error} = await supabase
        .from("order")
        .select("*");

      if (data?.length !== 0 && data !== null) {
        orders.push(...data);
      }
    } catch (err) {
      console.log(err);
    }

    return orders;
  }

  public async prepareOrders(orders: any[]) {
    const orderItems = new Array();

    for (const order of orders) {
      let {data: products, errorProducts} = await supabase
        .from("order-item-container")
        .select("*")
        .eq("order_id", order.id);

      let {data: restaurant, errorRestaurant} = await supabase
        .from("restaurant")
        .select("name, address")
        .eq("id", order.restaurant_id);

      orderItems.push({
        items: products,
        restaurant: (restaurant !== null) ? restaurant[0] : {},
      });

    }

    let newItemsArray: Array<any> = []; // we'll put there the items + the data about their name, container, etc

    for (const orderItem of orderItems) {
      for (const item of orderItem.items) {
        let {data: container, containerError} = await supabase
          .from("container")
          .select("name")
          .eq("id", item.container_id);

        let {data: itemFromDB, itemError} = await supabase
          .from("item")
          .select("name, category")
          .eq("id", item.item_id);

        if (container !== null && itemFromDB != null) {
          let newItem = {
            id: item.id,
            restaurant_name: orderItem.restaurant.name,
            itemName: itemFromDB[0].name,
            itemCategory: itemFromDB[0].category,
            containerName: container[0].name,
            quantity: item.quantity,
            canceled_by_lab: item.canceled_by_lab,
          };

          newItemsArray.push(newItem);
        }
      }
    }

    return newItemsArray;
  }
}

