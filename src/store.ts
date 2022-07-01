import { makeAutoObservable } from "mobx"

import { supabase }  from './supabaseClient'


type Item = {
    id: string,
    name: string,
    quantity: number,
    container: string,
    container_id: string

}

type ItemCategory = {

    name: string,
    items: Array<Item>

}

type Container = {
    name: string,
    id: string
}

type ContainerCategory = {
    name: string,
    containers: Array<Container>
}


type User = {
    id: string,
    username: string,
    role: Role,
    restaurant_id: string
}

type Restaurant = {
    id: string,
    name: string,
    address: string
}

type Status = "On order" | "Ordered" | "In preperation" | "Prepared" | "In delivery" | "Delivered" | "Received"

type Role = "Admin" | "Manager" | "Labo" | "Livreur" | "Anon"

class Store {

    itemCategories: Array<ItemCategory> = []
    containerCategories: Array<ContainerCategory> = []

    order: Array<Item> = []
    orderStatus: Status = "On order"
    orderId: string = ""
    orderComment: string = ""

    date: string = "DD/MM/YYYY"
    
    isLoggedIn = false

    restaurant: Restaurant = {
        id: "",
        name: "",
        address: ""
    }

    user: User = {
        id: "",
        username: "Anon",
        role: "Anon",
        restaurant_id: ""
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
                    id: item.id,
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
                containersList.push({
                    name: container.name,
                    id: container.id
                })
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
        this.containerCategories.push(category)
    }


    /**
     * This function adds an item to the order, or updates it if the item has already been ordered
     * @param name name of the item
     * @param quantity amount needed
     * @param container type of container needed
     */
    updateOrder(id:string, name: string, quantity: number, container: Container) {

        let hasUpdated: boolean = false

        this.order.forEach((item: Item)=>{
            if (item.name === name) {
                item.container = container.name,
                item.container_id = container.id,
                item.quantity = quantity
                hasUpdated = true
            }
        })

        if (!hasUpdated) { // item is not in the array
            this.order.push({
                id: id,
                name: name,
                quantity: quantity,
                container: container.name,
                container_id: container.id
            })
        }

    }

    /**
     * This function sends the order to the database
     */
    async sendOrder() {
        const { data: order, orderError } = await supabase
            .from('order')
            .insert([
                {
                    created_at: new Date().toISOString(), // toISOString is needed to be able to send to supabase
                    restaurant_id: this.restaurant.id,
                    created_by: this.user.id,
                    comment: this.orderComment
                },
            ])

            let orderArray:Array<any> = []

            if (order !== null && order.length > 0)
            {

                this.orderId = order[0].id 

                this.order.forEach((item:Item)=>{
                    orderArray.push({
                        canceled_by_lab: false,
                        item_id: item.id,
                        container_id: item.container_id,
                        order_id: order[0].id,
                        quantity:item.quantity
                    })
                })
                
                const { data:orderItems, orderItemsError } = await supabase
                    .from('order-item-container')
                    .insert(orderArray)

            }
    }

    /**
     * This function updates the comment on the order
     * @param comment This string is the comment that was left by the manager
     */
    updateOrderComment(comment: string) {
        this.orderComment = comment
    }


    /**
     * This function is used to update the store's data when a user logs in
     * @param user Logged-in user's information
     */
    async logIn(user: any) {
        this.isLoggedIn = true
        this.user = {
            id:user.id,
            username: user.username,
            role: user.role,
            restaurant_id: user.restaurant_id || ""
        } // logging in the user


        // updating the restaurant (if the user is a manager)
        if (this.user.role === "Manager") {
            let {data: restaurant, error} = await supabase
                .from('restaurant')
                .select('*')
                .eq('id', user.restaurant_id)

            if (restaurant?.length !== 0 && restaurant !== null) // restaurant is an array
                this.restaurant = {
                    id: restaurant[0].id,
                    name: restaurant[0].name,
                    address: restaurant[0].address
                }
        }

    }

    /**
     * This function updates the store's data when a user logs out
     */
    logOut() {
        this.isLoggedIn = false
        this.user = {
            id:"",
            username: "Anon",
            role: "Anon",
            restaurant_id: ""
        }

        this.restaurant = {
            id: "",
            name: "",
            address: ""
        }
    }

}

const store = new Store

await store.addItems()
await store.addContainers()

export default store