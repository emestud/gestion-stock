import { createClient } from '@supabase/supabase-js';
import { Status } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const logIn = async (username: string, password: string) => {

    let { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username);

    let errorMessage = "";

    if (user === null) user = []; // hacky thingy to prevent typescript from being a pain in the arm

    if (user.length === 0) {
        errorMessage = "Le nom d'utilisateur ou le mot de passe est incorrect";
        return [null, errorMessage];
    } 
    else {
        let userSingle = user[0]; // user is an array of size 1
        if (userSingle.password === password) {
            //console.log(userSingle)
            return [userSingle, errorMessage];
        }
        else {
            errorMessage = "Le nom d'utilisateur ou le mot de passe est incorrect";
            return [null, errorMessage];
        }
    }

}

/**************************** ORDERS ****************************/

export const getOrderByID = async (orderID: string) => {

    let {data: order, error} = await supabase
        .from('order')
        .select('*')
        .eq('id', orderID);
    if (order !== null) {
        return order[0];
    }
    else return null;

}

export const getOrdersByDate = async (date:string) => {
    let {data: orders, error} = await supabase
        .from("order")
        .select("*")
        .eq('created_at', date);

    return orders;
}

export const getAllOrders = async () => {

    let {data: orders, error} = await supabase
        .from('order')
        .select('*');

    return orders;   
}

export const getOrdersWithRestaurantName = async () => {
    const {data} = await supabase
        .from('order')
        .select(`
            *,
            restaurant:restaurant_id(
                name
            )
        `)

    return data === null ? [] : data;
}

export const getAllOriginalOrders = async () => {

    let {data: orders, error} = await supabase
        .from('order')
        .select('*')
        .is('original_order', null);

    return orders;   
}

export const getLastModificationOfOrder = async (originalOrderID: string) => {

    let {data: lastModification, error} = await supabase
        .from('order')
        .select('*')
        .eq('original_order', originalOrderID)
        .eq('isLastModifiedOrder', true);

    if (lastModification !== null && lastModification.length>0) {
        return lastModification[0];
    }
    else return null;

}

export const sendOrders = async (orders: Array<any>) => {
    const {data, error} = await supabase
        .from('order')
        .insert(orders);
    
    return data
}

export const updateOldModificationsOfOrder = async (originalOrderID: string, modifiedOrderID: string) => {
    const { data, error } = await supabase
        .from('order')
        .update({isLastModifiedOrder: false})
        .eq('original_order', originalOrderID)
        .neq('id', modifiedOrderID);
}

export const updateOrderStatus = async (orderID: string, status: Status) => {
    let {data, error} = await supabase
        .from('order')
        .update({status: status})
        .eq('id', orderID);
}

export const updateOrderComment = async (orderID: string, comment: string) => {
    let {data, error} = await supabase
        .from('order')
        .update({comment: comment})
        .eq('id', orderID);
}

export const updateOrderDate = async (orderID: string, date: string) => {
    let {data} = await supabase
        .from('order')
        .update({created_at: date})
        .eq('id', orderID);
}

/**************************** WASTES ****************************/

export const getWasteByID = async (wasteID: string) => {

    let {data: waste, error} = await supabase
        .from('waste')
        .select('*')
        .eq('id', wasteID);
    
    if (waste !== null) {
        return waste[0];
    }
    else return null;

}

export const getWastesByDate = async (date:string) => {
    let {data: wastes, error} = await supabase
        .from("waste")
        .select("*")
        .eq('created_at', date);

    return wastes;
}

export const getAllWastes = async () => {

    let {data: wastes, error} = await supabase
        .from('waste')
        .select('*');

    return wastes;   
}

export const getWastesWithRestaurantName = async () => {
    const {data} = await supabase
        .from('waste')
        .select(`
            *,
            restaurant:restaurant_id(
                name
            )
        `)

    return data === null ? [] : data;
}

export const sendWastes = async (wastes: Array<any>) => {
    const {data, error} = await supabase
        .from('waste')
        .insert(wastes);
    
    return data
}


/**************************** ITEMS ****************************/

export const getItemsWithContainer = async () => {

    const {data: items} = await supabase
            .from('item')
            .select(`*,
                container:default_container(
                    id,
                    name
                )
            `);
    
    return items;
}

export const getItemByID = async (itemID: string) => {
    let {data: itemFromDB} = await supabase
    .from("item")
    .select("*")
    .eq("id", itemID);

    if (itemFromDB !== null && itemFromDB.length>0) {
        return itemFromDB[0];
    }

}

export const getItemCategories = async () => {

    let tmp:Array<string> = [];

    let { data: categories } = await supabase
        .from('item')
        .select('category');

    if (categories !== null) {
        for (const cat of categories) {
            if (!tmp.includes(cat.category)) {
                tmp.push(cat.category);
            }
        }
    }

    return tmp;
}


/**************************** CONTAINERS ****************************/

export const getContainers = async () => {
    let { data: containers } = await supabase
        .from('container')
        .select('*');
    
    return containers
}

export const getContainerNameByID = async (containerID: string) => {
    let {data: container} = await supabase
        .from("container")
        .select("name")
        .eq("id", containerID);
    
        if (container !== null && container.length > 0) {
            return container[0].name;
        }
        else return "";
}

export const getContainerCategories = async () => {
    let tmp:Array<string> = [];

    let { data: categories } = await supabase
        .from('container')
        .select('category');

    if (categories !== null) {
        for (const cat of categories) {
            if (!tmp.includes(cat.category)) {
                tmp.push(cat.category);
            }
        }
    }

    return tmp;
}


/**************************** ORDER-ITEM-CONTAINER ****************************/

export const sendOrderItems = async (itemsArray: Array<any>) => {
    
    console.log(itemsArray)

    const { data:orderItems } = await supabase
        .from("order-item-container")
        .insert(itemsArray);
    
        return orderItems;
}

export const get3TupleFromOrder = async (orderID: string) => {
    let {data: products} = await supabase
        .from("order-item-container")
        .select("*")
        .eq("order_id", orderID);
    
    if (products !== null)
        return products;
    else return [];
}

export const getItemsFromOrder = async (orderID: string) => {
    let {data: items} = await supabase
        .from('order-item-container')
        .select(`  
             quantity, 
             item:item_id(
                id,
                name,
                priority
            ),
            container: container_id(
                id,
                name
            )
        `)
        .eq('order_id', orderID);
    
        if (items !== null) {
            return items;
        }
        else {
            return [];
        }
}

export const updateItemCancelStatus = async (itemID: string, cancel: boolean) => {
    const { data, error } = await supabase
        .from('order-item-container')
        .update({ canceled_by_lab: cancel })
        .eq('id', itemID);
}

/**************************** WASTE-ITEM-CONTAINER ****************************/

export const sendWasteItems = async (itemsArray: Array<any>) => {
    const { data:wasteItems } = await supabase
        .from("waste-item-container")
        .insert(itemsArray);
    
        return wasteItems;
}

export const getItemsFromWaste = async (wasteID: string) => {
    let {data: items} = await supabase
        .from('waste-item-container')
        .select(`  
             quantity, 
             item:item_id(
                id,
                name,
                priority
            ),
            container: container_id(
                id,
                name
            )
        `)
        .eq('waste_id', wasteID);
    
        if (items !== null) {
            return items;
        }
        else {
            return [];
        }
}

/**************************** RESTAURANTS ****************************/

export const getRestaurantData = async (restaurantID: string) => {
    
    const {data: restaurant} = await supabase
        .from('restaurant')
        .select('*')
        .eq('id', restaurantID);

    if (restaurant !== null) {
        return restaurant[0]
    }
    else return null;
}

export const getRestaurantsName = async () => {
    
    let tmp:Array<string> = []; 
    
    let {data: restaurants} = await supabase
        .from('restaurant')
        .select('name')
    
    if (restaurants !== null)
        for (const rest of restaurants) {
            if (!tmp.includes(rest.name)) {
                tmp.push(rest.name);
            }
        } 

    return tmp;
}

/**************************** LOGS ****************************/

export const logUserAuth = async (userID: string, logMessage: string) => {
    let {data: log} = await supabase
        .from('log-auth')
        .insert({
            user_id: userID,
            log_message: logMessage 
        });
}