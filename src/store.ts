import { makeAutoObservable } from "mobx"

type Item = {
    name: string,
    quantity: number,
    container: string

}

type Category = {

    name: string,
    items: Array<Item>

}

class Store {

    categories: Array<Category> = []

    constructor() {
        makeAutoObservable(this)
    }

    addCategory(category: Category) {
        this.categories.push(category)
    }

}


const store = new Store

store.addCategory({
    name: "Produit végétaux",
    items: [{
        name:"Tomate",
        quantity: 0,
        container: "Bac 1/6 profond"
    },
    {
        name: "Avocat",
        quantity: 0,
        container: "Barquettes"
    }]
})

export default store