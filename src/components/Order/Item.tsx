import { useState } from "react"
import store from "../../stores/store"


const getContainerID = (containerName: string):string => {

    let container_id = "";

    store.containerCategories.forEach(((category: any)=>{
        category.containers.forEach((container:any)=>{
            if (container.name===containerName)
            container_id = container.id;
        });
    }));
    return container_id;
}


const Item = (props: any) => {

    let {id, name, containerProp} = props;

    let [quantity, setQuantity] = useState(0);
    let [container, setContainer] = useState(containerProp);

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity);

        if (newQuantity !== 0) {
            store.updateOrder(id, name, newQuantity, {name: container, id:getContainerID(container)})
        }
    }

    const handleContainerChange = (newContainer: string) => {
        setContainer(newContainer)

        if (quantity !== 0) {
            store.updateOrder(id, name, quantity, {name: newContainer, id:getContainerID(newContainer)})
        }
    }


    return (
        <div className="flex justify-center gap-1">
            <p className="w-1/3 flex justify-center items-center text-center border border-solid border-slate-300 rounded-lg">{name}</p>
            <select className="w-1/3 select select-bordered" name="Container" id="container-select" defaultValue={containerProp}
                    onChange={(event)=>handleContainerChange(event.target.value)} disabled={store.order.status!=="On order"}>
                {store.containerCategories.map(category=>
                    <optgroup label={category.name}>
                        {category.containers.map(container=>
                            <option value={container.name}>
                                {container.name}
                            </option>
                        )}
                    </optgroup>
                )}
            </select>
            <input className="w-1/3 input input-bordered" type="number" min="0" placeholder="0" disabled={store.order.status!=="On order"}
                    onChange={(event)=>handleQuantityChange(parseInt(event.target.value))} />
        </div>
    );
}

export default Item;
