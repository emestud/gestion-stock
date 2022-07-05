import store from "../stores/store";
import { Order } from "../types";

import { useEffect, useState } from "react";
import OrderHistory from "../components/History/OrderHistory";

import { useNavigate } from "react-router-dom";

const History = () => {

    const navigate = useNavigate();

    const [orders, setOrders]:any = useState([]);
    const [currentActiveTabID, setCurrentActiveTabID]:any = useState("");
    const [currentActiveTabDate, setCurrentActiveTabDate]: any = useState("")

    const getOrders = async () => {
        let tmp:Array<Order> = await store.orderStore.getOrders();
        setOrders(tmp);
    };

    useEffect(() => {
        getOrders();
    }, []);
    

    const updateActiveTab = (orderID: string, orderDate: string) => {
        setCurrentActiveTabID(orderID);
        setCurrentActiveTabDate(orderDate)
    };

    const ordersMap = orders.map((order:Order)=>
        <OrderHistory date={order.created_at} restaurant_id={order.restaurant_id} status={"Préparé"} key={order.id} isActive={order.id===currentActiveTabID}
                    updateActiveTab={()=>updateActiveTab(order.id, order.created_at)}
            />
    );

    const openOrder = () => {
        if (store.user.role === 'Labo') {
            navigate('/lab', {
                state: {
                    date: currentActiveTabDate // needed so we can later fetch all the orders for a given date
                }
            }) 
        }
        else if (store.user.role === 'Livreur') {
            navigate('/delivery', {
                state: {
                    date: currentActiveTabDate // needed so we can later fetch all the orders for a given date
                }
            }) 
        }
        else {
            navigate('/order', {
                state: {
                    order_id: currentActiveTabID // needed so we can later fetch all the orders for a given date
                }
            }) 
        }
    }

    return (
        <div>
            <div>
                <h1 className="text-2xl text-center mb-8">Historique</h1>
                <table className="z-0 w-full table table-compact lg:ml-8 md:table-normal">
                    <thead>
                        <th>Date</th>
                        <th>Restaurant</th>
                        <th>Adresse</th>
                        <th>Status</th>
                    </thead>
                    <tbody>
                        {ordersMap}
                    </tbody>
                </table>
            </div>
            <button className={`fixed bottom-[5%] left-1/2 -translate-x-2/4 w-1/2 max-w-lg btn btn-primary ${currentActiveTabID==="" ? 'btn-disabled':''}`} 
                    onClick={openOrder}>
                Ouvrir
            </button>
        </div>
    );
}

export default History;