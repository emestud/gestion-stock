import { createClient } from '@supabase/supabase-js';
import { Order } from './types';

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

    if (lastModification !== null) {
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

export const sendWastes = async (wastes: Array<any>) => {
    const {data, error} = await supabase
        .from('order')
        .insert(wastes);
    
    return data
}