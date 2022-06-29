import store from "../../../store"

const CancelButton = (props:any) => {

    let {isOrdered, setIsOrdered} = props

    const cancelOrder = () => {
        store.orderStatus = "On order"
        setIsOrdered(!isOrdered)
    }

    return (
        <button className="flex text-white justify-center w-fit m-auto text-2xl px-4 py-2 shadow-xl bg-red-400 hover:bg-red-500 
                                active:bg-red-500 active:border border-white border-solid 
                                focus:bg-red-500 focus:border
                                md:w-2/3 lg:w-1/2 max-w-2xl" 
                onClick={cancelOrder}>
            Annuler la commande
        </button>
    )

} 


export default CancelButton