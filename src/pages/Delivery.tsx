import store from "../stores/store";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { Item } from "../types";

import RestaurantDelivery from "../components/Delivery/RestaurantDelivery";

import Spin from '../assets/spin.svg'

const sortItemsByRestaurant = (orderItems:any) => {
    
    if (orderItems === undefined || orderItems === null || orderItems.length===0) {
        return [];
    }

    let restaurants:Array<string> = [];

    for (const item of orderItems) {
        if (!restaurants.includes(item.restaurant_name)) {
            restaurants.push(item.restaurant_name);
        }
    }

    let itemsByRestaurant:Array<Array<Item>> = [];
    let restaurantItem:Array<Item> = []

    for (const restaurant of restaurants) {
        for (const item of orderItems) {
            if (item.restaurant_name === restaurant) {
                restaurantItem.push(item);
            }
        }
        itemsByRestaurant.push(restaurantItem);
        restaurantItem = [];
    }

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
    //let [itemsByRestaurant, setItemsByRestaurant]: any = useState([]);
    let [dataLoading, setDataLoading]: any = useState(true);

    useEffect(() => {
        (async () => {
          const orders = await store.orderStore.getOrders(ordersDate);
          const orderItemsTmp = await store.orderStore.prepareOrders(orders);
          setOrderItems(orderItemsTmp);
          setDataLoading(false);
        })();
      }, []);

    return (
        <> {
            dataLoading ?
            (<img src={Spin} alt="spin" className="m-auto mt-24 stroke-transparent"/>)
            :
            (<>
                <ol className="flex gap-2 h-3/4 w-11/12 m-auto p-4 overflow-x-scroll mt-20">
                    {sortItemsByRestaurant(orderItems).map((restaurant:Array<any>)=>
                        <li className="flex flex-col w-fit min-w-full md:min-w-[50%] lg:min-w-[25%] gap-2 items-center justify-between h-full bg-slate-200 p-4 rounded-xl overflow-y-scroll">
                            <h2 className="text-xl text-center font-bold ">{restaurant[0].restaurant_name}</h2>
                            <RestaurantDelivery restaurant_items={restaurant} key={restaurant[0].restaurant_name}/>
                            <button className="btn btn-primary h-10">Valider la livraison</button>
                        </li>
                    )}
                </ol>
            </>)
            }
        </>
    );
}

export default Delivery;