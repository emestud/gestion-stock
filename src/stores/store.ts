import {makeAutoObservable} from "mobx";
import {supabase} from "../supabaseClient";
import {Container, ContainerCategory, Item, ItemCategory, Order, OrderItem, Restaurant, Status, User} from "../types";
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

    originalOrder: Order = {
        id: "",
        items: [],
        status: "On order",
        comment: "", 
        created_at: "",
        restaurant_id: ""
    }

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
        this.addItems();
        this.addContainers();
        


        makeAutoObservable(this);
    }

    /**
     * This function initiates the orders, on the store creation, with two empty orders 
     */
    async initOrder() {
        const {data: items} = await supabase
            .from('items')
            .select('*')

        if (items !==  null) {
            for (const item of items) {
                this.order.items.push({
                    id: item.id,
                    name: item.name,
                    quantity: [0, 0],
                    container: [
                        {id: "2ebe580d-66e2-4a9a-94e1-6b4edf70f617", name:"Bac 1/6"},
                        {id: "2ebe580d-66e2-4a9a-94e1-6b4edf70f617", name:"Bac 1/6"},
                    ],
                    priority: item.priority
                })
            }
        }
    }

    /**
     * This function fetchs all the items from supabase, sorts them by category and adds it to the store
     */
    async addItems() {

        // Adding the items to the store
        let { data: categories } = await supabase
        .from('item')
        .select('category');

        let { data: items } = await supabase
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
        let { data: categories } = await supabase
        .from('container')
        .select('category');

        let { data: containers } = await supabase
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
     * This function adds an item to the order, or updates it if the item has already been ordered
     * @param name name of the item
     * @param quantity amount needed
     * @param container type of container needed
     */
    updateOrder(id:string, name: string, quantity: number, container: Container, priority: number) {

        let hasUpdated: boolean = false;

        console.log(`${name}: ${quantity} ${container.name}`);

        this.order.items.forEach((item: OrderItem)=>{
            if (item.name === name) {
                item.container[1].name = container.name,
                item.container[1].id = container.id,
                item.quantity[1] = quantity
                hasUpdated = true
            }
        });

    }

    /**
     * This function sends the order to the database
     */
    async sendOrder() {
        const { data: order } = await supabase
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
                sessionStorage.setItem('order_id', this.order.id);

                for (let item of this.order.items) {
                    
                    if (item.quantity[1] > 0) {
                        let orderItem = {
                            canceled_by_lab: false,
                            item_id: item.id,
                            container_id: item.container[1].id,
                            order_id: order[0].id,
                            quantity:item.quantity[1],
                            priority: item.priority
                        };

                        orderArray.push(orderItem);
                    }
                }

                const { data, error } = await supabase
                    .from('order-item-container')
                    .delete()
                    .eq('order_id', this.order.id);

                // sending everything in one request
                const { data:orderItems } = await supabase
                    .from('order-item-container')
                    .insert(orderArray);

            }
    }

    /**
     * This function modifies the order in the database
     */
    async modifyOrder() {
        
        const { data: order } = await supabase
            .from('order')
            .insert([
                {
                    created_at: new Date().toISOString(), // toISOString is needed to be able to send to supabase
                    restaurant_id: this.restaurant.id,
                    created_by: this.user.id,
                    comment: this.order.comment,
                    status: "Ordered",
                },
            ]);

            let orderArray:Array<any> = []; // array containing the (order-item-containers) 3-tuple

            if (order !== null && order.length > 0)
            {

                this.order.id = order[0].id;
                sessionStorage.setItem('order_id', this.order.id);

                for (let item of this.order.items) {
                    
                    let orderItem = {
                        canceled_by_lab: false,
                        item_id: item.id,
                        container_id: item.container[1].id,
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
                const { data:orderItems } = await supabase
                    .from('order-item-container')
                    .insert(orderArray);

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
            for (const item of items) {

                for (const orderItem of this.order.items) {
                    if (item.name === orderItem.name) {
                        orderItem.container[0].name = item.container.name;
                        orderItem.quantity[0] = item.quantity
                    }
                }

                let newItem:Item = {
                    id: item.item.id,
                    name: item.item.name,
                    quantity: item.quantity,
                    container: item.container.name,
                    container_id: item.container.id,
                    priority: item.item.priority 
                };

                // changing the items inside the "default" list of items (updating quantity and container)
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
                .eq('id', orderID);
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

        const {data: restaurant} = await supabase
            .from('restaurant')
            .select('name, address')
            .eq('id', restaurant_id);

        return restaurant;
    }

    async getListRestaurantsName() {
        let {data} = await supabase
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

        sessionStorage.setItem('user', JSON.stringify(this.user));

        // updating the restaurant (if the user is a manager)
        if (this.user.role === "Manager") {
            let {data: restaurant} = await supabase
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
        let {data: log} = await supabase
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
        let {data: log} = await supabase
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

        sessionStorage.setItem('user', "");

        this.restaurant = {
            id: "",
            name: "",
            address: ""
        };
    }

}

const store = new Store();

export default store;
