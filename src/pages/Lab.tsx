import {useEffect, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";

import store from "../stores/store";

const Lab = ({params}:any) => {

  const location:any = useLocation();
  const ordersDate = location.state.date;

  const navigate = useNavigate()

  if (store.user.role !== "Labo" && store.user.role !== "Admin") {
    navigate('/unauthorized');
  }

  const date = new Date().toISOString();
  let [orderItems, setOrderItems]: any = useState([]);

  useEffect(() => {
    (async () => {
      const orders = await store.orderStore.getOrders(ordersDate);
      const orderItemsTmp = await store.orderStore.prepareOrders(orders);
      setOrderItems(orderItemsTmp);
    })();
  }, []);

  return (
    <div>
      <ol className="w-11/12 max-w-screen-md flex flex-col gap-8">
        {orderItems.map((oi: any) =>
          <li key={oi.id}>{oi.quantity}x {oi.itemName}</li>,
        )}
      </ol>
    </div>
  );
};

export default Lab;
