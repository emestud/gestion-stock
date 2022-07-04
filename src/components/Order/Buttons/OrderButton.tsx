import store from "../../../stores/store"

const OrderButton = (props:any) => {

    let {isOrdered, setIsOrdered} = props;

    const sendOrder = async () => {
        store.orderStatus = "Ordered";
        setIsOrdered(!isOrdered);

        await store.sendOrder();
    }

    return (
        <button className="flex justify-center w-fit m-auto text-2xl btn md:w-2/3 lg:w-1/2 max-w-2xl"
                onClick={sendOrder}>
            Valider la commande
        </button>
    );

}


export default OrderButton;
