import store from "../stores/store";
import { Order } from "../types";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import OrderHistory from "../components/History/OrderHistory";
import WasteHistory from '../components/History/WasteHistory'

import Spinner from "../components/Misc/Spinner";
import { getOrdersWithRestaurantName, getWastesWithRestaurantName } from "../databaseClient";

const History = () => {

    const navigate = useNavigate();

    const [orders, setOrders]:any = useState([]);
    const [wastes, setWastes]:any = useState([]);

    // this variable is true if an order has already been created for a restaurant on the current date
    const [orderAlreadyExists, setOrderAlreadyExists]: any = useState(false);
    const [dataLoading, setDataLoading]: any = useState(true);

    const [currentMode, setCurrentMode]: any = useState("Order");


    const changeMode = () => {
        if (currentMode === 'Order') {
            store.orderMode = 'Order';
            setCurrentMode('Waste');
        }
        else {
            store.orderMode = 'Waste';
            setCurrentMode('Order');
        }
    }


    const getOrders = async () => {
        //let tmp:Array<Order> = await store.orderStore.getOrders(null);
        let tmp:Array<any> = await getOrdersWithRestaurantName();
        setOrders(tmp);

        for (const order of tmp) { // checking if an order has already been created for today 

            let today = new Date();
            let todayFormated = today.toLocaleDateString('en-CA');
            if ((order.restaurant_id === store.user.restaurant_id && todayFormated === order.created_at)) {
                setOrderAlreadyExists(true);
                return;
            }

        }
    };

    const getWastes = async () => {
        //let tmp: Array<any> = await store.orderStore.getWastes(null);
        let tmp: Array<any> = await getWastesWithRestaurantName();
        setWastes(tmp);
    }

    useEffect(() => {
        getOrders();
        getWastes();
        setDataLoading(false);
    }, []);

    const ordersMap = orders.map((order:any)=>
        <OrderHistory date={order.created_at} restaurantName={order.restaurant.name} status={order.status} key={order.id}
                        openOrder={()=>openOrder(order.id, order.created_at)}
            />
    );

    const wastesMap = wastes.map((waste:any)=>
        <WasteHistory date={waste.created_at} restaurantName={waste.restaurant.name} key={waste.id}
                        openWaste={()=>openOrder(waste.id, waste.created_at)}
        />
    )

    const openOrder = (orderID: string, orderDate:string) => {
        if (store.user.role === 'Labo') {
            navigate('/lab', {
                state: {
                    date: orderDate // needed so we can later fetch all the orders for a given date
                }
            }) 
        }
        else if (store.user.role === 'Livreur') {
            navigate('/delivery', {
                state: {
                    date: orderDate// needed so we can later fetch all the orders for a given date
                }
            }) 
        }
        else {
            navigate('/order', {
                state: {
                    order_id: orderID,// needed so we can later fetch all the orders for a given date
                    mode: currentMode
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
                    <div className={`flex justify-between items-center px-4 ${(store.user.role==='Manager' || store.user.role==='Admin') ? '' : 'hidden'}`}>
                        <div>
                            <button onClick={newOrder} className={`btn btn-sm btn-accent m-2 lg:ml-8 ${orderAlreadyExists ? 'btn-disabled' : ''}`}>
                                Nouvelle commande
                            </button>
                            <button onClick={newWaste} className="btn btn-sm btn-secondary m-2 lg:ml-8">
                                Déclarer pertes
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <p className={`${currentMode === 'Order' ? 'font-bold underline' : ''}`}>Commandes</p>
                            <input type="checkbox" className="toggle" checked={currentMode==='Waste'} onChange={changeMode}/>
                            <p className={`${currentMode === 'Waste' ? 'font-bold underline' : ''}`}>Pertes</p>     
                        </div>
                    </div>
                    <table className="z-0 w-full table table-compact lg:ml-8 md:table-normal">
                        <thead>
                            <tr>
                                <th className="absolute" style={{position: "static"}}>Date</th>
                                <th>Restaurant</th>
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMode === 'Order' ? ordersMap : wastesMap}
                        </tbody>
                    </table>
                </div>
            </>)}
        </div>
    );
}

export default History;