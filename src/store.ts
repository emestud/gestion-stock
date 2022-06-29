import { makeAutoObservable } from "mobx"

import { supabase } from './supabaseClient'

type Item = {
    name: string,
    quantity: number,
    container: string

}

type Category = {

    name: string,
    items: Array<Item>

}

type User = {
    name: string,
    role: Role
}

type Status = "On order" | "Ordered" | "In preperation" | "Prepared" | "In delivery" | "Delivered" | "Received"

type Role = "Admin" | "Manager" | "Labo" | "Livreur" | "Anon"

class Store {

    categories: Array<Category> = []
    order: Array<Item> = []
    orderStatus: Status = "Ordered"

    date: string = "DD/MM/YYYY"
    restaurant: String = "Restaurant 1"
    user: User = {
        name: "Anon",
        role: "Anon"
    }

    constructor() {
        makeAutoObservable(this)
    }

    addCategory(category: Category) {
        this.categories.push(category)
    }

    updateOrder(name: string, quantity: number, container: string) {

        let hasUpdated: boolean = false

        this.order.forEach((item: Item)=>{
            if (item.name === name) {
                item.container = container
                item.quantity = quantity
                hasUpdated = true
            }
        })

        if (!hasUpdated) { // item is not in the array
            this.order.push({
                name: name,
                quantity: quantity,
                container: container
            })
        }

    }

}

const store = new Store

// Adding the items to the store
let { data: categories, error } = await supabase
  .from('item')
  .select('category')

let listCategories:Array<string> = []

categories?.forEach((category:any)=>{
    if (!listCategories.includes(category.category))
        listCategories.push(category.category)
})

listCategories.forEach(async (category)=>{
    let { data: items, error } = await supabase
        .from('item')
        .select('*')
        .eq('category', category)
    
    let products:Array<Item> = []

    items?.forEach(item=>{
        products.push({
            name: item.name,
            quantity: 0,
            container: "Bac 1/6 profond"
        })
    })

    store.addCategory({
        name: category,
        items: products
    })

})


export default store