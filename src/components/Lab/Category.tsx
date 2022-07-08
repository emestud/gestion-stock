import { useEffect, useState } from "react";
import Item from "./Item";

const Category = ({itemsByCategory, restaurants}:any) => {
    
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
                                <th style={{ position: 'static'}} >Quantité</th>
                                <th>Récipient</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {itemsByCategory.map((item:any)=>
                        <Item item={item}/>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Category