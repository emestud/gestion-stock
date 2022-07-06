import store from "../stores/store";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { Item } from "../types";

import RestaurantDelivery from "../components/Delivery/RestaurantDelivery";

const sortItemsByRestaurant = (orderItems:any) => {
    
    if (orderItems === undefined || orderItems === null || orderItems.length===0) {
        return [];
    }

    //console.log(orderItems)

    let itemsByRestaurant:Array<Array<Item>> = [];
    let restaurantItem:Array<Item> = []
    let currRestaurant: string = orderItems[0].restaurant_name

    for (const item of orderItems) {
        if (item.restaurant_name === currRestaurant) {
            restaurantItem.push(item);
        }
        else {
            itemsByRestaurant.push(restaurantItem);
            restaurantItem = [item];
            currRestaurant = item.restaurant_name;
        }
    }
    itemsByRestaurant.push(restaurantItem);

    return itemsByRestaurant;
}

const Delivery = () => {

    const navigate = useNavigate()

    const location:any = useLocation();
    const ordersDate = location.state.date;

    if (store.user.role !== "Livreur" && store.user.role !== "Admin") {
        navigate('/unauthorized');
    }

    let [orderItems, setOrderItems]: any = useState([]);
    let [itemsByRestaurant, setItemsByRestaurant]: any = useState([]);

    useEffect(() => {
        (async () => {
          const orders = await store.orderStore.getOrders(ordersDate);
          const orderItemsTmp = await store.orderStore.prepareOrders(orders);
          setOrderItems(orderItemsTmp);
        })();
      }, []);

    return (
        <ol className="h-3/4 w-11/12 m-auto p-4 overflow-x-scroll">
            {sortItemsByRestaurant(orderItems).map((restaurant:Array<any>)=>
                <li className="flex flex-col gap-2 items-center justify-between h-full bg-slate-200 p-4 rounded-xl overflow-y-scroll">
                    <RestaurantDelivery restaurant_items={restaurant} key={restaurant[0].restaurant_name}/>
                    <button className="btn btn-primary h-10">Valider la livraison</button>
                </li>
            )}
        </ol>
    );
}

export default Delivery;