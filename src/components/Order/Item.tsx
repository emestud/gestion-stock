import { useState } from "react"
import store from "../../store"

const Item = (props: any) => {

    let {name, containerProp} = props 

    let [quantity, setQuantity] = useState(0)
    let [container, setContainer] = useState(containerProp)

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity)
        
        if (newQuantity !== 0) {
            store.updateOrder(name, newQuantity, container)
        }
    }

    const handleContainerChange = (newContainer: any) => {
        setContainer(newContainer)
        
        if (quantity !== 0) {
            store.updateOrder(name, quantity, newContainer)
        }
    }

    return (
        <div className="flex justify-center">
            <p className="w-1/3 border border-black border-solid truncate">{name}</p>
            <input className="w-1/3 border border-black border-solid" value={quantity} type="number" min="0" disabled={store.orderStatus!=="On order"}
                    onChange={(event)=>handleQuantityChange(parseInt(event.target.value))} />
            <select className="w-1/3 border border-black border-solid" name="Container" id="container-select" defaultValue={containerProp}
                    onChange={(event)=>handleContainerChange(event.target.value)} disabled={store.orderStatus!=="On order"}>
                <optgroup label="Bacs">
                    <option value="Grand Bac 1/1" >Grand Bac 1/1</option>
                    <option value="Bac bleu 1/2">Bac bleu 1/2</option>
                    <option value="Bac 1/3">Bac 1/3</option>
                    <option value="Bac bleu 1/3">Bac bleu 1/3</option>
                    <option value="Bac 1/6">Bac 1/6</option>
                    <option value="Bac 1/6 profond">Bac 1/6 profond</option>
                    <option value="Bac 1/6 petit">Bac 1/6 petit</option>
                    <option value="Bac">Bac</option>
                </optgroup>
                <optgroup label="Packs">
                    <option value="Pack">Pack</option>
                    <option value="Pack grand">Pack grand</option>
                    <option value="Pack petit">Pack petit</option>
                </optgroup>
                <optgroup label="Autre">
                    <option value="Barquette">Barquette</option>
                    <option value="Boîte">Boîte</option>
                    <option value="Sac">Sac</option>
                    <option value="Sachet">Sachet</option>
                    <option value="Conserve">Conserve</option>
                    <option value="Block">Block</option>
                    <option value="Unite">Unite</option>
                    <option value="Carton">Carton</option>
                    <option value="Bidon">Bidon</option>
                </optgroup>
            </select>
        </div>
    )
}

export default Item