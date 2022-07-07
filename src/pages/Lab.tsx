import {useEffect, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";

import store from "../stores/store";
import { Item } from "../types";

import Category from "../components/Lab/Category";

const Lab = () => {

  const location:any = useLocation();
  const ordersDate = location.state.date;

  const navigate = useNavigate()

  if (store.user.role !== "Labo" && store.user.role !== "Admin") {
    navigate('/unauthorized');
  }

  let [orderItems, setOrderItems]: any = useState([]);

  useEffect(() => {
    (async () => {
      const orders = await store.orderStore.getOrders(ordersDate);
      const orderItemsTmp = await store.orderStore.prepareOrders(orders);
      setOrderItems(orderItemsTmp);
    })();
  }, []);

  let itemsByCategory = [];

  if (orderItems.length > 0) {
    let lastPriority:number = orderItems[0].priority;
    let category:Array<Item> = [];

    for (const item of orderItems) { // separating items based on their category (= priority)
      if (item.priority === lastPriority) {
        category.push(item);
      }
      else {
        itemsByCategory.push(category);
        category = [item];
        lastPriority = item.priority;
      }
    }
    itemsByCategory.push(category);
  }

  return (
    <div className="mt-20">
      <ol className="w-11/12 max-w-screen-md flex flex-col gap-8">
        {itemsByCategory.map((cat: any) =>
          <Category key={cat[0].id} itemsByCategory={cat} />
        )}
      </ol>
      <button className="fixed bottom-[5%] left-1/2 -translate-x-2/4 w-1/2 max-w-lg btn btn-primary">Valider la commande</button>
    </div>
  );
};

export default Lab;
