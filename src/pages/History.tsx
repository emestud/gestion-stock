import store from "../stores/store";
import { Order } from "../types";

import { useEffect, useState } from "react";
import OrderHistory from "../components/History/OrderHistory";

import { useNavigate } from "react-router-dom";

import Spinner from "../components/Misc/Spinner";

const History = () => {

    const navigate = useNavigate();

    const [orders, setOrders]:any = useState([]);
    const [currentActiveTabID, setCurrentActiveTabID]:any = useState("");
    const [currentActiveTabDate, setCurrentActiveTabDate]: any = useState("");

    // this variable is true if an order has already been created for a restaurant on the current date
    const [orderAlreadyExists, setOrderAlreadyExists]: any = useState(false);
    const [dataLoading, setDataLoading]: any = useState(true);

    const getOrders = async () => {
        let tmp:Array<Order> = await store.orderStore.getOrders(null);
        setOrders(tmp);

        for (const order of tmp) { // checking if an order has already been created for today 

            let today = new Date();
            let todayFormated = today.toLocaleDateString('en-CA');
            if (order.restaurant_id === store.user.restaurant_id && todayFormated === order.created_at) {
                setOrderAlreadyExists(true);
                return;
            }

        }
    };

    useEffect(() => {
        getOrders();
        setDataLoading(false);
    }, []);
    


    const updateActiveTab = (orderID: string, orderDate: string, event: any) => {
        setCurrentActiveTabID(orderID);
        setCurrentActiveTabDate(orderDate)

        if (event.detail >= 2) {
            openOrder()
        }
    };

    const ordersMap = orders.map((order:Order)=>
        <OrderHistory date={order.created_at} restaurant_id={order.restaurant_id} status={order.status} key={order.id} isActive={order.id===currentActiveTabID}
                    updateActiveTab={(event: any)=>updateActiveTab(order.id, order.created_at, event)}
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
                    order_id: currentActiveTabID, // needed so we can later fetch all the orders for a given date
                    mode: 'Order'
                }
            }) 
        }
    }   

    const newOrder = () => {
        navigate('/order', {
            state: {
                order_id: '',
                mode: 'Order'
            }
        })
    }

    const newWaste = () => {
        navigate('/order', {
            state: {
                order_id: '',
                mode: 'Waste'
            }
        })
    }

    return (
        <div className="mt-20">
            {dataLoading ? 
            (<Spinner />)
            :
            (<>
                <div>
                    <h1 className="text-2xl text-center mb-8">Historique</h1>
                    <div>
                        <button onClick={newOrder} className={`btn btn-sm btn-accent m-2 lg:ml-8 ${orderAlreadyExists ? 'btn-disabled' : ''} ${(store.user.role==='Manager' || store.user.role==='Admin') ? '' : 'hidden'}`}>
                            Nouvelle commande
                        </button>
                        <button onClick={newWaste} className={`btn btn-sm btn-secondary m-2 lg:ml-8 ${(store.user.role==='Manager' || store.user.role==='Admin') ? '' : 'hidden'}`}>
                            Déclarer pertes
                        </button>
                    </div>
                    <table className="z-0 w-full table table-compact lg:ml-8 md:table-normal">
                        <thead>
                            <tr>
                                <th className="absolute">Date</th>
                                <th>Restaurant</th>
                                <th>Statut</th>
                            </tr>
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
            </>)}
        </div>
    );
}

export default History;