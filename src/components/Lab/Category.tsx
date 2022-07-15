import { useEffect, useState } from "react";
import Item from "./Item";

const restaurantIsInItemsList = (restaurant: string, itemList: Array<any>) => {

    for (const item of itemList) {
        if (item.restaurant === restaurant) {
            return true;
        }
    }
    return false;
}

const Category = ({itemsByCategory, restaurants, addItemToCancel}:any) => {

    for (const item of itemsByCategory) {
        for (const quantity of item.quantities) {
            if (quantity.length < restaurants.length) {
                for (const restaurant of restaurants) {
                    if (!restaurantIsInItemsList(restaurant, quantity)) {
                        quantity.push({
                            quantity: 0,
                            restaurant: restaurant
                        });
                    }
                }
            }
        }
        for (const container of item.containers) {
            if (container.length < restaurants.length) {
                for (const restaurant of restaurants) {
                    if (!restaurantIsInItemsList(restaurant, container)) {
                        container.push({
                            container: "Aucun",
                            restaurant: restaurant
                        });
                    }
                }
            }
        }
    }

    return (
        <div>
            <h1 className="m-4 lg:ml-12 text-xl font-bold">{itemsByCategory[0].itemCategory}</h1>
            <table className="z-0 w-full table table-compact table-zebra lg:ml-8 md:table-normal">
                <thead>
                    <tr>
                        <th rowSpan={2}  style={{ position: 'static'}} >
                            Produit
                        </th>
                        {restaurants.map((restaurant:string)=>
                            <th colSpan={2} rowSpan={1}>{restaurant}</th>
                        )}
                        <th rowSpan={2}>Annulé ?</th>
                    </tr>
                    <tr>
                        {restaurants.map((_:string)=>
                            <>
                                <th style={{ position: 'static'}} className="text-center">#</th>
                                <th className="text-center">Récipient</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {itemsByCategory.map((items:any)=>
                        <Item items={items} addItemToCancel={addItemToCancel}/>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Category