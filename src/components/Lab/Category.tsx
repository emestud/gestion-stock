import { Item } from "../../types";

const Category = ({itemsByCategory}:any) => {

    let restaurants:Array<string> = [];
    for (const item of itemsByCategory) {
        if (!restaurants.includes(item.restaurant_name)) {
            restaurants.push(item.restaurant_name);
        }
    }

    return (
        <div>
            <h1 className="m-4 lg:ml-12 text-xl font-bold">{itemsByCategory[0].itemCategory}</h1>
            <table className="z-0 w-full table table-compact table-zebra lg:ml-8 md:table-normal">
                <thead>
                    <tr>
                        <th rowSpan={2}>Produit</th>
                        {restaurants.map((restaurant:string)=>
                            <th colSpan={2} rowSpan={1}>{restaurant}</th>
                        )}
                        <th rowSpan={2}>Annulé ?</th>
                    </tr>
                    <tr>
                        {restaurants.map((restaurant:string)=>
                            <>
                                <th>Quantité</th>
                                <th>Récipient</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {itemsByCategory.map((item:any)=>
                        <>
                            <tr>
                                <td>{item.itemName}</td>
                                <td>{item.quantity}</td>
                                <td>{item.containerName}</td>
                                <td><input type="checkbox" className="checkbox" /></td>
                            </tr>
                        </>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Category