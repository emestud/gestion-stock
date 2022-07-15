import { useState } from "react"
import store from "../../stores/store"
import { proxyPrint } from "../../utils";


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

    let {id, name, containerProp, quantityProp, priority, isOrdered, isEditable, item} = props;

    let [quantity, setQuantity] = useState(quantityProp);

    let [newQuantity, setNewQuantity] = useState(quantityProp[1]);
    let [oldQuantity, setOldQuantity] = useState(quantityProp[0]);
    let quantityDiff = newQuantity - oldQuantity;

    let [oldContainer, setOldContainer] = useState(containerProp[0]);
    let [newContainer, setNewContainer] = useState(containerProp[1]);
    let containerChanged = oldContainer.name !== newContainer.name;

    let [numberInputIncorrect, setNumberInputIncorrect]:any = useState(false);

    const handleQuantityChange = (newQuantityValue: number) => {
        
        if (isNaN(newQuantityValue)) {
            setNumberInputIncorrect(true);
            return;
        }
        else {
            setNumberInputIncorrect(false);
        }

        if (newQuantityValue < 0) {
            let input = document.getElementById("quantityInput") as HTMLInputElement;
            if (input!==null) {
                input.value = "0";
            }
            setNewQuantity(0);
            return;
        }

        setNewQuantity(newQuantityValue);

        if (newQuantity !== 0) {
            store.updateOrder(id, name, newQuantityValue, {name: newContainer.name, id:newContainer.id}, priority)
        }
    }

    const handleContainerChange = (newContainerValue: string) => {
        setNewContainer({
            id: newContainer.id,
            name: newContainerValue
        })

        if (quantity !== 0) {
            store.updateOrder(id, name, newQuantity, {name: newContainerValue, id:newContainer.id}, priority)
        }
    }


    return (
        <div className="flex justify-center gap-1">
            <p className="w-1/3 flex justify-center items-center text-center border border-solid border-slate-300 rounded-lg select-none">{name}</p>
            <select className={`w-1/3 select select-bordered ${containerChanged ? 'bg-yellow-300' : ''}`} name="Container" id="container-select" defaultValue={newContainer.name}
                    onChange={(event)=>handleContainerChange(event.target.value)} disabled={isOrdered || !isEditable}>
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
            <input id="quantityInput" className={`w-3/12 input input-bordered 
                                ${quantityDiff > 0 ? 'bg-green-300' : (quantityDiff < 0 ? 'bg-red-500' : '')}
                                ${numberInputIncorrect ? 'bg-red-900': ''}`} 
                    type="text" min="0" pattern="[0-9]*" disabled={isOrdered || !isEditable} placeholder={newQuantity}
                    onChange={(event)=>handleQuantityChange(parseInt(event.target.value))} />
        </div>
    );
}

export default Item;
