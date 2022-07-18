import {useEffect, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";

import store from "../stores/store";
import { Item } from "../types";

import Category from "../components/Lab/Category";

import Spinner from "../components/Misc/Spinner";
import { itemIsInArray } from "../utils";

const Lab = () => {

  const location:any = useLocation();
  const ordersDate = location.state.date;

  const navigate = useNavigate()

  if (store.user.role !== "Labo" && store.user.role !== "Admin") {
    navigate('/unauthorized');
  }

  let [orderItems, setOrderItems]: any = useState([]);
  let [restaurants, setRestaurants]: any = useState([]);
  let [itemsToCancel, setItemsToCancel]: any = useState([]);
  let [dataLoading, setDataLoading]: any = useState(true);
  let [orderIDs, setOrderIDs]:any = useState([]);

  let [isDelivered, setIsDelivered]:any = useState(false);
  let [isPrepared, setIsPrepared]:any = useState(false);

  useEffect(() => {
    (async () => {
      const restaurants = await store.getListRestaurantsName();

      const originalOrders = await store.orderStore.getOrders(ordersDate);
      const orders = await store.orderStore.getModifiedOrders(originalOrders);

      for (const order of orders) {
        setOrderIDs([...orderIDs, [order[0].id, order[1].id]]);
        if (order[1].status === 'Delivered') { // if one order has already been delivered, it means that the other orders are being delivered or already delivered
          setIsDelivered(true);
        }
      }

      let modifiedOrders: Array<any> = [];
      for (const tuple of orders) {
        modifiedOrders.push(tuple[1]);
      }

      const originalOrdersItemsTmp = await store.orderStore.prepareOrders(originalOrders);
      const originalOrdersItemsGatheredByRestaurant = store.orderStore.gatherItemsForLab(originalOrdersItemsTmp);

      const modifiedOrdersItemsTmp = await store.orderStore.prepareOrders(modifiedOrders);
      const modifiedOrdersItemsGatheredByRestaurant = store.orderStore.gatherItemsForLab(modifiedOrdersItemsTmp);

      let orderItemsTmp: Array<any> = []

      for (const item of modifiedOrdersItemsGatheredByRestaurant) {
        let originalItem = itemIsInArray(originalOrdersItemsGatheredByRestaurant, item.name);
        if (originalItem !== null)
        {
          orderItemsTmp.push({
            name: item.name,
            priority: item.priority,
            containers: [originalItem.containers, item.containers],
            quantities: [originalItem.quantities, item.quantities],
            canceled_by_lab: item.canceled_by_lab
          });
        }
        else {

          let containers:Array<any> = [];
          let quantities: Array<any> = [];

          for (const restaurant of restaurants) {
            quantities.push({
              restaurant: restaurant,
              quantity: 0
            })
            containers.push({
              restaurant: restaurant,
              container: "Aucun"
            })
          }

          orderItemsTmp.push({
            name: item.name,
            priority: item.priority,
            containers: [containers, item.containers],
            quantities: [quantities, item.quantities],
            canceled_by_lab: item.canceled_by_lab
          })
        }
      }

      setOrderItems(orderItemsTmp);
      setRestaurants(restaurants);
      setDataLoading(false);
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

  /**
   * This function adds an item to the array of items to be canceled
   * @param isToBeCanceled boolean saying weither or not the item should be cancled
   * @param item_id string representing the item id
   */
  const addItemToCancel = (isToBeCanceled: boolean, item_ids: Array<string>) => {
    if (isToBeCanceled) { // adding the item
      for (const item_id of item_ids) {
        setItemsToCancel((oldArray:Array<any>)=>[...oldArray, [item_id, true]])
      }
    }
    else { // removing the item or uncanceling it
      for (const item_id of item_ids) {
        if (itemsToCancel.includes(item_id)) {
          let itemsTmp = itemsToCancel.filter((item:string)=>item[0]!==item_id)
          setItemsToCancel(itemsTmp);
        }
        else {
          setItemsToCancel((oldArray:Array<any>)=>[...oldArray, [item_id, false]])
        }
      }
    }
  }

  /**
   * This function validate the order. It changes its status tu prepared and cancels the items that must be canceled
   */
  const confirmOrder = () => {
    store.cancelItems(itemsToCancel);
    setIsPrepared(true);
    for (const order of orderIDs) {
      store.updateOrderStatus("Prepared", order[0]); // original order
      store.updateOrderStatus("Prepared", order[1]); // modified order  
    }
  }


  return (
    <div className="mt-20">
      {dataLoading ? 
      (<Spinner />)
      :
      (<>
        <ol className="w-screen flex flex-col gap-8 h-[120vh] overflow-y-scroll">
          {itemsByCategory.map((cat: any) =>
            <Category key={cat[0].id} itemsByCategory={cat} restaurants={restaurants} addItemToCancel={addItemToCancel}/>
          )}
        </ol>
        {isDelivered ?
          <button className="fixed bottom-[5%] left-1/2 -translate-x-2/4 w-1/2 max-w-lg btn btn-disable" >La commandes a été livrée</button>
          :
            isPrepared ? 
              <button className="fixed bottom-[5%] left-1/2 -translate-x-2/4 w-1/2 max-w-lg btn btn-disable" >Commande Validée</button>
              :
              <button className="fixed bottom-[5%] left-1/2 -translate-x-2/4 w-1/2 max-w-lg btn btn-primary" onClick={confirmOrder} >Valider la commande</button>
        }
      </>)}
    </div>
  );
};

export default Lab;
