import store from "../../../store"

const OrderButton = (props:any) => {

    let {isOrdered, setIsOrdered} = props

    const sendOrder = () => {
        store.orderStatus = "Ordered"
        setIsOrdered(!isOrdered)
    }

    return (
        <button className="flex justify-center w-fit m-auto text-2xl px-4 py-2 shadow-xl bg-white hover:bg-slate-200 
                                active:bg-slate-300 active:border border-black border-solid 
                                focus:bg-slate-300 focus:border
                                md:w-2/3 lg:w-1/2 max-w-2xl" 
                onClick={sendOrder}>
            Valider la commande
        </button>
    )

} 


export default OrderButton