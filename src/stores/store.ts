import {$mobx, makeAutoObservable} from "mobx";
import LogInModal from "../components/Auth/LogInModal";

import {supabase} from "../supabaseClient";
import {Container, ContainerCategory, Item, ItemCategory, Order, Restaurant, Status, User} from "../types";
import {OrderStore} from "./order-store";


class Store {

    itemCategories: Array<ItemCategory> = [];
    containerCategories: Array<ContainerCategory> = [];

    orderStore: OrderStore;

    order: Order = {
        id: "",
        items: [],
        status: "On order",
        comment: "", 
        created_at: "",
        restaurant_id: ""
    };

    isLoggedIn = false;

    restaurant: Restaurant = {
        id: "",
        name: "",
        address: ""
    };

    user: User = {
        id: "",
        username: "Anon",
        role: "Anon",
        restaurant_id: ""
    };

    constructor() {
        this.orderStore = new OrderStore();
        makeAutoObservable(this);
    }

    /**
     * This function fetchs all the items from supabase, sorts them by category and adds it to the store
     */
    async addItems() {

        // Adding the items to the store
        let { data: categories, errorCategories } = await supabase
        .from('item')
        .select('category');

        let { data: items, errorItems } = await supabase
            .from('item')
            .select('*');

        let listCategories:Array<string> = [];

        categories?.forEach((category:any)=>{
        if (!listCategories.includes(category.category))
            listCategories.push(category.category);
        });

        for (const category of listCategories) {

            let categoryItems:Array<any> = [];
            items?.forEach((item:any)=>{
                if (item.category===category) {
                    categoryItems.push(item);
                }
            });

            let products:Array<Item> = [];

            categoryItems?.forEach(item=>{
                products.push({
                    id: item.id,
                    name: item.name,
                    quantity: 0,
                    container: "Bac 1/6 profond",
                    container_id: "56262456-d89a-4d8b-b833-be377504f88b", // TODO modify later, maybe items having a default container (name+id) would be nice,
                    priority: item.priority
                });
            })

            store.addItemCategory({
                name: category,
                items: products
            });

        }
    }

    /**
     * This function adds the item category given as a parameter to the store
     * @param category This is the ItemCategory that we want to add to the store
     */
    addItemCategory(category: ItemCategory) {
        this.itemCategories.push(category);
    }

    /**
     * This function fetchs all the containers from supabase, sorts them by category and adds it to the store
     */
    async addContainers() {

        // Adding the containers to the store
        let { data: categories, errorCategories } = await supabase
        .from('container')
        .select('category');

        let { data: containers, errorItems } = await supabase
            .from('container')
            .select('*');

        let listCategories:Array<string> = [];

        if (categories !== null)
            for (const category of categories){
                if (!listCategories.includes(category.category))
                    listCategories.push(category.category);
            }

        for (const category of listCategories) {

            let categoryContainers:Array<Container> = [];
            if (containers !== null)
                for (let container of containers){
                    if (container.category===category) {
                        categoryContainers.push(container);
                    }
                }

            let containersList:Array<Container> = [];

            categoryContainers?.forEach(container=>{
                containersList.push({
                    name: container.name,
                    id: container.id
                });
            });

            store.addContainerCategory({
                name: category,
                containers: containersList
            });

        }
    }

    /**
     * This function adds the container category given as a parameter to the store
     * @param category This is the ContainerCategory that we want to add to the store
     */
     addContainerCategory(category: ContainerCategory) {
        this.containerCategories.push(category);
    }

    /**
     * This function fetchs an returns an order from the DB
     * @param orderID number representing the order ID
     */
    async getOrder(orderID: number){
        let {data: order, error} = await supabase
            .from('order')
            .select('*')
            .eq('id', orderID);
        
            if (order !== null && order.length !== 0) {
                return order[0];
            }
    }


    /**
     * This function adds an item to the order, or updates it if the item has already been ordered
     * @param name name of the item
     * @param quantity amount needed
     * @param container type of container needed
     */
    updateOrder(id:string, name: string, quantity: number, container: Container, priority: number) {

        let hasUpdated: boolean = false;

        console.log(`${name}: ${quantity} ${container.name}`);

        this.order.items.forEach((item: Item)=>{
            if (item.name === name) {
                item.container = container.name,
                item.container_id = container.id,
                item.quantity = quantity
                hasUpdated = true
            }
        });

        if (!hasUpdated) { // item is not in the array
            this.order.items.push({
                id: id,
                name: name,
                quantity: quantity,
                container: container.name,
                container_id: container.id,
                priority: priority
            });
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
                    comment: this.order.comment,
                    status: "Ordered"
                },
            ]);

            let orderArray:Array<any> = []; // array containing the (order-item-containers) 3-tuple

            if (order !== null && order.length > 0)
            {

                this.order.id = order[0].id;

                for (let item of this.order.items) {
                    
                    let orderItem = {
                        canceled_by_lab: false,
                        item_id: item.id,
                        container_id: item.container_id,
                        order_id: order[0].id,
                        quantity:item.quantity,
                        priority: item.priority
                    };

                    orderArray.push(orderItem);
                }

                const { data, error } = await supabase
                    .from('order-item-container')
                    .delete()
                    .eq('order_id', this.order.id);

                // sending everything in one request
                const { data:orderItems, orderItemsError } = await supabase
                    .from('order-item-container')
                    .insert(orderArray);

            }
    }

    /**
     * This function modifies the order in the database
     */
    async modifyOrder() {
        
        let newOrderItems = [];

        for (let item of this.order.items) {  // TODO: maybe think of a way to avoid useless API calls => check if item is inside the order.items array
            try {
                let {data, error} = await supabase
                    .from('order-item-container')
                    .update({
                        container_id: item.container_id,
                        quantity: item.quantity
                    })
                    .eq('order_id', store.order.id).eq('item_id', item.id)
                
                if (error) {
                    throw new Error(`Supabase error: ${error}`);
                }
                else {
                    let {data:log, error} = await supabase
                        .from('log-order')
                        .insert({
                           user_id: this.user.id,
                           log: `Quantité de ${item.name} passé à ${item.quantity} ${item.container}` 
                        });
                }
            }
            catch (err) { // item was not in the order
                let orderItem = {
                    canceled_by_lab: false,
                    item_id: item.id,
                    container_id: item.container_id,
                    order_id: this.order.id,
                    quantity:item.quantity,
                    priority: item.priority
                };

                newOrderItems.push(orderItem);

                let {data:log, error} = await supabase
                        .from('log-order')
                        .insert({
                           user_id: this.user.id,
                           log: `${item.name} ajouté: ${item.quantity} ${item.container}` 
                        });
            }
        }

        if (newOrderItems.length > 0) { // pushing the new items
            let {data, error} = await supabase
                .from('order-item-container')
                .insert(newOrderItems);
        }

    }

    /**
     * this function update the sotre order based on the orderID givn as parameter
     * @param orderID the ID of the current order
     */
    async setOrder(orderID: string) {

        this.resetOrder();

        this.order.id = orderID;
        this.order.status = "Ordered";
        //this.order.created_at = "" // TODO set created_at
        // TODO updated restaurant info

        let {data: items, errorItems} = await supabase
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
            for (const item of items) {

                let newItem:Item = {
                    id: item.item.id,
                    name: item.item.name,
                    quantity: item.quantity,
                    container: item.container.name,
                    container_id: item.container.id,
                    priority: item.item.priority 
                };

                this.order.items.push(newItem);

                // changing the items inside the "default" list of items 
                for (const category of this.itemCategories) {
                    for (let itemInCat of category.items) {
                        if (itemInCat.name === newItem.name) {
                            itemInCat = Object.assign(itemInCat, newItem);
                        }
                    }
                }
            }
        }
        return this.itemCategories;
    }

    /**
     * This function reset the order object
     */
    resetOrder() {
        this.order = {
            id: "",
            items: [],
            status: "On order",
            comment: "", 
            created_at: "",
            restaurant_id: ""
        };

        // changing the items inside the "default" list of items 
        for (const category of this.itemCategories) {
            for (let itemInCat of category.items) {
                itemInCat.quantity = 0;
                itemInCat.container = "Bac 1/6 profond";
                itemInCat.container_id = "56262456-d89a-4d8b-b833-be377504f88b";
            }
        }

        
    }

    /**
     * This function sets the value 'cancled_by_lab' to true for every order-item-container object in the DB which ID is inside the array (param).
     * @param itemsToCancel array of ID
     */
    async cancelItems(itemsToCancel:Array<string>) {
        for (const item of itemsToCancel) {
            const { data, error } = await supabase
                .from('order-item-container')
                .update({ canceled_by_lab: 'true' })
                .eq('id', item);
        }
    }

    /**
     * This function updates the comment on the order
     * @param comment This string is the comment that was left by the manager
     */
    async updateOrderComment(comment: string, orderID: string) { // TODO update comment inside the DB
        this.order.comment = comment;

        if (orderID !== "") {
            let {data, error} = await supabase
                .from('order')
                .update({comment: comment})
                .eq('id', order_id);
        }
    }

    /**
     * 
     * 
     * 
     */
    async updateOrderStatus(status: Status, orderID: string) {
        this.order.status = status

        if (orderID !== "") {
            let {data, error} = await supabase
                .from('order')
                .update({status: status})
                .eq('id', orderID);
        }
    }


    /**
     * This function returns the restaurant name and adress given a restaurant ID 
     * @param restaurant_id the ID of the restaurant
     */
    async getRestaurantData(restaurant_id: string) {

        const {data: restaurant, error} = await supabase
            .from('restaurant')
            .select('name, address')
            .eq('id', restaurant_id);

        return restaurant;
    }

    async getListRestaurantsName() {
        let {data, error} = await supabase
            .from('restaurant')
            .select('name')

        let restaurantNames:Array<string> = [];

        if (data !== null)
        for (const rest of data) {
            restaurantNames.push(rest.name)
        }

        return restaurantNames
    }

    /**
     * This function is used to update the store's data when a user logs in
     * @param user Logged-in user's information
     */
    async logIn(user: User) {
        this.isLoggedIn = true;
        this.user = {
            id:user.id,
            username: user.username,
            role: user.role,
            restaurant_id: user.restaurant_id || ""
        }; // logging in the user


        // updating the restaurant (if the user is a manager)
        if (this.user.role === "Manager") {
            let {data: restaurant, error} = await supabase
                .from('restaurant')
                .select('*')
                .eq('id', user.restaurant_id);

            if (restaurant?.length !== 0 && restaurant !== null) // restaurant is an array
                this.restaurant = {
                    id: restaurant[0].id,
                    name: restaurant[0].name,
                    address: restaurant[0].address
                };
        }

        // pushing the log to the table
        let {data: log, errorLog} = await supabase
            .from('log-auth')
            .insert({
                user_id: user.id,
                log_message: `User logged in` 
            });

    }

    /**
     * This function updates the store's data when a user logs out
     */
    async logOut() {

        // pushing the log to the table
        let {data: log, errorLog} = await supabase
            .from('log-auth')
            .insert({
                user_id: this.user.id,
                log_message: `User logged out` 
            });

        this.isLoggedIn = false;
        this.user = {
            id:"",
            username: "Anon",
            role: "Anon",
            restaurant_id: ""
        };

        this.restaurant = {
            id: "",
            name: "",
            address: ""
        };
    }

}

const store = new Store();
const orderStore = new OrderStore();

await store.addItems();
await store.addContainers();

export default store;
