import { makeAutoObservable } from "mobx"
import Category from "./components/Order/Category"

import { supabase } from './supabaseClient'

type Item = {
    name: string,
    quantity: number,
    container: string

}

type ItemCategory = {

    name: string,
    items: Array<Item>

}

type Container = string

type ContainerCategory = {
    name: string,
    containers: Array<Container>
}


type User = {
    name: string,
    role: Role
}

type Status = "On order" | "Ordered" | "In preperation" | "Prepared" | "In delivery" | "Delivered" | "Received"

type Role = "Admin" | "Manager" | "Labo" | "Livreur" | "Anon"

class Store {

    itemCategories: Array<ItemCategory> = []
    containerCategories: Array<ContainerCategory> = []

    order: Array<Item> = []
    orderStatus: Status = "On order"

    date: string = "DD/MM/YYYY"
    restaurant: String = "Restaurant 1"
    user: User = {
        name: "Anon",
        role: "Anon"
    }

    constructor() {
        makeAutoObservable(this)
    }

    /**
     * This function fetchs all the items from supabase, sorts them by category and adds it to the store
     */
    async addItems() {

        // Adding the items to the store
        let { data: categories, errorCategories } = await supabase
        .from('item')
        .select('category')
        
        let { data: items, errorItems } = await supabase
            .from('item')
            .select('*')

        let listCategories:Array<string> = []

        categories?.forEach((category:any)=>{
        if (!listCategories.includes(category.category))
            listCategories.push(category.category)
        })

        for (const category of listCategories) {
            
            let categoryItems:Array<any> = []
            items?.forEach((item:any)=>{
                if (item.category===category) {
                    categoryItems.push(item)
                }
            })
            
            let products:Array<Item> = []

            categoryItems?.forEach(item=>{
                products.push({
                    name: item.name,
                    quantity: 0,
                    container: "Bac 1/6 profond"
                })
            })

            store.addItemCategory({
                name: category,
                items: products
            })

        }
    }

    /**
     * This function adds the item category given as a parameter to the store
     * @param category This is the ItemCategory that we want to add to the store
     */
    addItemCategory(category: ItemCategory) {
        this.itemCategories.push(category)
    }

    /**
     * This function fetchs all the containers from supabase, sorts them by category and adds it to the store
     */
    async addContainers() {

        // Adding the containers to the store
        let { data: categories, errorCategories } = await supabase
        .from('container')
        .select('category')
        
        let { data: containers, errorItems } = await supabase
            .from('container')
            .select('*')

        let listCategories:Array<string> = []

        categories?.forEach((category:any)=>{
        if (!listCategories.includes(category.category))
            listCategories.push(category.category)
        })

        for (const category of listCategories) {
            
            let categoryContainers:Array<any> = []
            containers?.forEach((container:any)=>{
                if (container.category===category) {
                    categoryContainers.push(container)
                }
            })
            
            let containersList:Array<Container> = []

            categoryContainers?.forEach(container=>{
                containersList.push(container.name)
            })

            store.addContainerCategory({
                name: category,
                containers: containersList
            })

        }
    }

    /**
     * This function adds the container category given as a parameter to the store
     * @param category This is the ContainerCategory that we want to add to the store
     */
     addContainerCategory(category: ContainerCategory) {
        console.log(category)
        this.containerCategories.push(category)
    }


    /**
     * This function adds an item to the order, or updates it if the item has already been ordered
     * @param name name of the item
     * @param quantity amount needed
     * @param container type of container needed
     */
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

await store.addItems()
await store.addContainers()

export default store