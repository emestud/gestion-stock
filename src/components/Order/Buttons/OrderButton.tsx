import store from "../../../stores/store"

const OrderButton = (props:any) => {

    let {isOrdered, setIsOrdered} = props;

    const sendOrder = async () => {

        if (store.order.items.length === 0) {
            return; // Cannot send the order, at least one item needs to be ordered
        }

        store.order.status = "Ordered";
        setIsOrdered(!isOrdered);

        
        if (store.order.id === ""){ // order has not been sent yet
            await store.sendOrder();
        }
        else {
            await store.modifyOrder();
        }
    }

    return (
        <button className="sticky top-[2.5%] flex justify-center w-fit m-auto text-2xl btn md:w-2/3 lg:w-1/2 max-w-2xl"
                onClick={sendOrder}>
            Valider la commande
        </button>
    );

}


export default OrderButton;
