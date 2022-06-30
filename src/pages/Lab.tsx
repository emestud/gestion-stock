import { supabase } from "../supabaseClient"
import { useEffect, useState } from "react"

const Lab = () => {

    const date = new Date().toISOString()
    let [ordersArray, setOrdersArray]:any = useState([])

    useEffect(()=>{
        async function fetchOrders() {
            try {
                let { data: orders, error } = await supabase
                    .from('order')
                    .select('*')
                    .eq('created_at', date)

                    if (orders?.length !== 0 && orders !== null)
                        setOrdersArray(orders)

            } catch(err) {
                console.log(err)
            }
        }
        fetchOrders()
    }, [])

    let orderItemsArray:Array<any> = []
    
    ordersArray.forEach(async (order:any)=>{
        let { data: products, errorProducts } = await supabase
            .from('order-item-container')
            .select('*')
            .eq('order_id', order.id)

        let { data: restaurant, errorRestaurant  } = await supabase
            .from('restaurant')
            .select('name, address')
            .eq('id', order.restaurant_id)

        orderItemsArray.push({
            items: products,
            restaurant: (restaurant !== null) ? restaurant[0] : {}
        })
    })

    let newItemsArray:Array<any> = [] // we'll put there the items + the data about their name, container, etc

    console.log(orderItemsArray)

    orderItemsArray.forEach(orderItem=>{
        console.log(orderItem)
        orderItem.items.forEach(async (item:any)=>{
            let { data:container, containerError} = await supabase
                .from('container')
                .select('name')
                .eq('id', item.container_id)
            
            let { data:itemFromDB, itemError } = await supabase
                .from('item')
                .select('name, category')
                .eq('id', item.item_id)
        
            if (container !== null && itemFromDB!= null) {
                let newItem = {
                    id: item.id,
                    restaurant_name: orderItem.restaurant.name, 
                    itemName: itemFromDB[0].name,
                    itemCategory: itemFromDB[0].category,
                    containerName: container[0].name,
                    quantity: item.quantity, 
                    canceled_by_lab: item.canceled_by_lab,
                }

                console.log(newItem)

                newItemsArray.push(newItem)
            }
        })
    })

    /* TODO 
        - Régler le bug qui m'empêche d'accceder aux données
        - Trier les items par catégories, pour avoir une affichage semi-similaire à celui de la page "Order"
        - Regrouper les item qui ont le même nom et récipients (mais des restaurants/quanitités différentes)
    */

    return (
        <div>
            <ol className="w-11/12 max-w-screen-md flex flex-col gap-8">
            </ol>
        </div>
    )

}

export default Lab