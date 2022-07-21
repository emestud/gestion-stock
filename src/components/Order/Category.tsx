import { useEffect, useState } from 'react';
import Item from './Item'

import store from '../../stores/store'

const Category = (props: any) => {

    let { categoryName, isOrdered, isEditable } = props;

    let [items, setItems]:any = useState([]);

    useEffect(()=>{
        setItems(store.getItemsOfCategory(categoryName));
    },[]);

    let list = items.map((item:any, index:number) => 
        <li key={item.name}>
            <Item id={item.id} name={item.name} containerProp={item.container} priority={item.priority} 
                quantityProp={item.quantity} isOrdered={isOrdered} isEditable={isEditable} item={item} />
        </li>
    )

    return (
        <div>
            <h2 className="text-xl font-bold">{categoryName}</h2>
            <ol className="flex flex-col gap-1">
                {list}
            </ol>
        </div>
    );

}


export default Category;