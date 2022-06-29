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

let { data: item, error } = await supabase
  .from('item')
  .select('*')

console.log(item)

const store = new Store

store.addCategory({
    name: "Produit végétaux 🍅",
    items: [
        {
            name:"Tomate",
            quantity: 0,
            container: "Bac 1/6 profond"
        },
        {
            name: "Avocat",
            quantity: 0,
            container: "Barquettes"
        },
        {
            name: "Oignons rouges",
            quantity: 0,
            container: "Bac 1/6 profond"
        },
        {
            name: "Galettes",
            quantity: 0,
            container: "Bac 1/3"
        },
        {
            name: "Salades",
            quantity: 0,
            container: "Boîte"
        },
        {
            name: "Salade Mozza",
            quantity: 0,
            container: "Boîte" // ?
        },
        {
            name: "Salade Burger",
            quantity: 0,
            container: "Bac bleu 1/3"
        },
        {
            name: "Tomates confites",
            quantity: 0,
            container: "Boîte"
        },
        {
            name: "Frites",
            quantity: 0,
            container: "Sac"
        },
        {
            name: "Choucroute crue",
            quantity: 0,
            container: "Seau"
        },
        {
            name: "Jalapenos",
            quantity: 0,
            container: "Bac 1/3"
        },
        {
            name: "Cornichons",
            quantity: 0,
            container: "Conserve"
        }
    ]
})


store.addCategory({
    name: "Produit animal 🍗",
    items: [
        {
            name: "Poulet",
            quantity: 0,
            container: "Sachet"
        },
        {
            name: "Bacon",
            quantity: 0,
            container: "Sachet"
        },
        {
            name: "Viande de Boeuf",
            quantity: 0,
            container: "Grand Bac 1/1"
        }
    ]
})


store.addCategory({
    name: "Sauce EMP",
    items: [
        {
            name: "Cocktail",
            quantity: 0,
            container: "Bac bleu 1/2"
        },
        {
            name: "Barbecue",
            quantity: 0,
            container: "Bac bleu 1/2"
        },
        {
            name: "Tartare",
            quantity: 0,
            container: "Bac bleu 1/2"
        },
        {
            name: "Vinaigrette",
            quantity: 0,
            container: "Bac bleu 1/2"
        },
    ]
})


store.addCategory({
    name: "Sauce sur place",
    items: [
        {
            name: "Cocktail",
            quantity: 0,
            container: "Bac 1/6"
        },
        {
            name: "Barbecue",
            quantity: 0,
            container: "Bac 1/6"
        },
        {
            name: "Tartare",
            quantity: 0,
            container: "Bac 1/6"
        },
        {
            name: "Raifort",
            quantity: 0,
            container: "Bac 1/6"
        },
    ]
})


store.addCategory({
    name:"Fromages 🧀",
    items: [
        {
            name: "Cheddar",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Emmental",
            quantity: 0,
            container: "Bac 1/3"
        },
        {
            name: "Raclette",
            quantity: 0,
            container: "Bac 1/3"
        },
        {
            name: "Bleu",
            quantity: 0,
            container: "Bac 1/6 petit"
        },
        {
            name: "Mozzarella",
            quantity: 0,
            container: "Block"
        },
        {
            name: "Parmesan",
            quantity: 0,
            container: "Pack"
        },
    ]
})


store.addCategory({
    name: "Cookies 🍪",
    items: [
        {
            name: "Blanc",
            quantity: 0,
            container: "Unite"
        },
        {
            name: "Noir",
            quantity: 0,
            container: "Unite"
        },
        {
            name: "Peanut",
            quantity: 0,
            container: "Unite"
        },
        {
            name: "Orange",
            quantity: 0,
            container: "Unite"
        }
    ]
})


store.addCategory({
    name: "Pain 🍞",
    items: [
        {
            name: "Pain",
            quantity: 0,
            container: "Unite"
        }
    ]
})


store.addCategory({
    name:"Boissons 🥤",
    items: [
        {
            name: "Canada Dry",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Dr. Pepper",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Coca zero",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Coca classique",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Coca cherry",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Carola",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Perrier",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "May tea pêche",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "May tea menthe",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Pulco",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Canette Starling",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Punk IPA",
            quantity: 0,
            container: "Pack"
        }
    ]
})


store.addCategory({
    name: "Emballage 📥",
    items: [
        {
            name: "Grands Sacs",
            quantity: 0,
            container: "Carton"
        },
        {
            name: "Petits Sacs",
            quantity: 0,
            container: "Sachet"
        },
        {
            name: "Serviettes",
            quantity: 0,
            container: "Carton"
        },
        {
            name: "Barquettes Frites",
            quantity: 0,
            container: "Carton"
        },
        {
            name: "Bowls Grands",
            quantity: 0,
            container: "Carton"
        },
        {
            name: "Couvercles Bowls",
            quantity: 0,
            container: "Sachets"
        },
        {
            name: "Sets de Table",
            quantity: 0,
            container: ""
        },
        {
            name: "Boîte XL",
            quantity: 0,
            container: "Carton"
        },
        {
            name: "Boîte XXL",
            quantity: 0,
            container: "Carton"
        },
        {
            name: "Couteaux",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Fourchettes",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Piques",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Pailles",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Gobelets",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Pots Sauce EMP",
            quantity: 0,
            container: "Pack petit"
        },
        {
            name: "Couvercles Sauce EMP",
            quantity: 0,
            container: "Pack grand"
        },
        {
            name: "Pots Sauce SP",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Sac Cookie",
            quantity: 0,
            container: ""
        },
        {
            name: "Sac cookies tamponés",
            quantity: 0,
            container: ""
        }
    ]
})


store.addCategory({
    name: "Divers",
    items:[
        {
            name: "Café",
            quantity: 0,
            container: "Sac"
        },
        {
            name: "Rouleaux TPE",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Rouleaux Caisse",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Agrafes",
            quantity: 0,
            container: "Boîte"
        },
        {
            name: "Feutres",
            quantity: 0,
            container: "Unite"
        },
        {
            name: "Huile friteuse",
            quantity: 0,
            container: "Bidon"
        },
        {
            name: "Poubelles 330L",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Poubelles toilettes 30L",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Poubelles 130L",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Encre tampon",
            quantity: 0,
            container: "Unite"
        },
        {
            name: "Eponges",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Destop",
            quantity: 0,
            container: "Unite"
        },
        {
            name: "Graine Chanvre",
            quantity: 0,
            container: "Bac"
        },
        {
            name: "Film plastique",
            quantity: 0,
            container: "Unite"
        },
        {
            name: "Grattoir plaque",
            quantity: 0,
            container: "Unite"
        },
        {
            name: "Lame grattoir",
            quantity: 0,
            container: "Unite"
        },
        {
            name: "Sous bocks Starling",
            quantity: 0,
            container: "Pack"
        },
        {
            name: "Verre Starling",
            quantity: 0,
            container: "Unite"
        },
        {
            name: "Filtres hottes",
            quantity: 0,
            container: "Unite"
        },
        {
            name: "Cheveux serpierre",
            quantity: 0,
            container: "Unite"
        }
    ]
})

export default store