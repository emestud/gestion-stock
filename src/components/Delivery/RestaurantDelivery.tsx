import { useEffect, useState } from "react";
import store from "../../stores/store";
import RestaurantDeliveryItems from "./RestaurantDeliveryItems"

const RestaurantDelivery = ({restaurant_items}:any) => {

    let orderID = restaurant_items[0].orderID;

    let [isDelivered, setIsDelivered]: any = useState(false);

    useEffect(()=>{
        (async ()=>{
            let {data, error} = await store.orderStore.getOrder(orderID);
            if (data !== null) {
                setIsDelivered(data[0].status === 'Delivered');
            }
        })();
    })

    const confirmDelivery = () => {
        store.updateOrderStatus("Delivered", orderID);
        setIsDelivered(true);
    }

    return (
        <li className="flex flex-col w-fit min-w-full md:min-w-[50%] lg:min-w-[25%] gap-2 items-center justify-between h-full bg-slate-200 p-4 rounded-xl overflow-y-scroll">
            <h2 className="text-xl text-center font-bold ">{restaurant_items[0].restaurant_name}</h2>
            <RestaurantDeliveryItems restaurant_items={restaurant_items} key={restaurant_items[0].restaurant_name}/>
            {isDelivered ?
                <button className="btn btn-primary h-10" onClick={confirmDelivery}>Valider la livraison</button>
                :
                <button className="btn btn-disabled h-10">La commande a été livrée</button>
            }
        </li>
    )
}

export default RestaurantDelivery