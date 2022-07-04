import {supabase} from "../supabaseClient";
import {useEffect, useState} from "react";
import store from "../stores/store";

const Lab = () => {

  const date = new Date().toISOString();
  let [orderItems, setOrderItems]: any = useState([]);

  useEffect(() => {
    (async () => {
      const orders = await store.orderStore.getOrders();
      const orderItemsTmp = await store.orderStore.prepareOrders(orders);
      setOrderItems(orderItemsTmp);
    })();
  }, []);


  /* TODO
      - Régler le bug qui m'empêche d'accceder aux données
      - Trier les items par catégories, pour avoir une affichage semi-similaire à celui de la page "Order"
      - Regrouper les item qui ont le même nom et récipients (mais des restaurants/quanitités différentes)
  */

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
