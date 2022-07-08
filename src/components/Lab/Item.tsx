import { useState } from 'react'

const Item = ({items, addItemToCancel}:any) => {

    const [isCanceled, setIsCanceled] = useState(false);

    const cancelItems = () => {
        let item_ids:Array<string> = [];

        for (const item of items.quantities) {
            if (item.item_order_id !== undefined) {
                item_ids.push(item.item_order_id);
            }
        }

        addItemToCancel(!isCanceled, item_ids);
        setIsCanceled(!isCanceled);
    }

    return (
        <>
            <tr>
                <td>{items.name}</td>
                {
                    items.quantities.map((quantity:any, index:number)=>
                        <>
                            <td className={`${quantity.quantity === 0 ? 'line-through brightness-75':''}`}>{quantity.quantity}</td>
                            <td className={`${quantity.quantity === 0 ? 'line-through brightness-75':''}`}>{items.containers[index].container}</td>
                        </>
                )}
                <td><input type="checkbox" className="checkbox" onClick={()=>cancelItems()}/></td>
            </tr>
        </>
    )
}

export default Item