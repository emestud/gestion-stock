import { useNavigate } from "react-router-dom";
import store from "../../../stores/store"

const OrderButton = (props:any) => {

    let {isOrdered, setIsOrdered, mode} = props;

    let navigate = useNavigate();

    const sendOrder = async () => {

        if (store.order.items.length === 0) {
            return; // Cannot send the order, at least one item needs to be ordered
        }

        store.order.status = "Ordered";
        setIsOrdered(!isOrdered);

        
        if (store.order.id === ""){ // order has not been sent yet
            await store.sendOrder(mode);
        }
        else {
            await store.modifyOrder(mode);
        }
        
        navigate('/');
    }

    return (
        <button className="sticky top-[3%] sm:top-[2.5%] flex text-white justify-center ml-24 md:m-auto p-0 w-8/12 h-fit m-auto text-xl btn md:w-2/3 lg:w-1/2 max-w-2xl"
                onClick={sendOrder}>
            Valider {mode === 'Order' ? 'la commande' : 'les pertes'}
        </button>
    );

}


export default OrderButton;
