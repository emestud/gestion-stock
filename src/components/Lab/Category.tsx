import { proxyPrint } from "../../utils";
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
        <div className="w-screen">
            <table className="z-0 w-full table table-compact table-zebra lg:ml-8 md:table-normal">
                <thead>
                    <tr>
                        <th rowSpan={2}  style={{ position: 'static'}} className="w-2/12">
                            Produit
                        </th>
                        {restaurants.map((restaurant:string)=>
                            <th colSpan={2} rowSpan={1} className="w-fit text-ellipsis">{restaurant}</th>
                        )}
                        <th rowSpan={2} className="w-2/12">Annulé ?</th>
                    </tr>
                    <tr>
                        {restaurants.map((_:string)=>
                            <>
                                <th style={{ position: 'static'}} className="text-center px-0">#</th>
                                <th className="text-center px-0">Récipient</th>
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