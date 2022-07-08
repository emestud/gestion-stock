import { useState } from 'react'

const Item = ({item}:any) => {

    const [isCanceled, setIsCanceled] = useState(false);

    const cancelItems = () => {
        setIsCanceled(!isCanceled);
    }

    return (
        <>
            <tr>
                <td>{item.name}</td>
                {
                    item.quantities.map((quantity:any, index:number)=>
                        <>
                            <td className={`${quantity.quantity === 0 ? 'line-through brightness-75':''}`}>{quantity.quantity}</td>
                            <td className={`${quantity.quantity === 0 ? 'line-through brightness-75':''}`}>{item.containers[index].container}</td>
                        </>
                )}
                <td><input type="checkbox" className="checkbox" onClick={cancelItems}/></td>
            </tr>
        </>
    )
}

export default Item