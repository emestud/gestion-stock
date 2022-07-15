import { useState } from 'react'

function quantityBgDiffColor(originalQuantities: Array<any>, modifiedQuantities: Array<any>, index: number) {
    if (originalQuantities[index].quantity < modifiedQuantities[index].quantity) {
        return 'bg-green-300';
    }
    else if (originalQuantities[index].quantity > modifiedQuantities[index].quantity) {
        return 'bg-red-500'
    }
    else {
        return ''
    }
}

function containerBgDiffColor(originalContainers: Array<any>, modifiedContainers: Array<any>, index: number) {
    if (originalContainers[index].container !== modifiedContainers[index].container) {
        return 'bg-yellow-300';
    }
    else {
        return ''
    }
}

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
                    items.quantities[1].map((quantity:any, index:number)=>
                        <>
                            <td className={`${quantityBgDiffColor(items.quantities[0], items.quantities[1], index)} text-center select-none ${quantity.quantity === 0 ? 'line-through brightness-75':''}`}>{quantity.quantity}</td>
                            <td className={`${containerBgDiffColor(items.containers[0], items.containers[1], index)} text-center select-none ${quantity.quantity === 0 ? 'line-through brightness-75':''}`}>{items.containers[1][index].container}</td>
                        </>
                )}
                <td><input type="checkbox" className="checkbox" onClick={()=>cancelItems()}/></td>
            </tr>
        </>
    )
}

export default Item