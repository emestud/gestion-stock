import store from "../../../stores/store"

const ModifyButton = (props:any) => {

    let {isOrdered, setIsOrdered} = props;

    const ModifyOrder = () => {
        store.order.status = "On order";
        setIsOrdered(!isOrdered);
    }

    return (
        <button className="flex text-white justify-center w-fit m-auto text-2xl btn btn-warning 
                                md:w-2/3 lg:w-1/2 max-w-2xl"
                onClick={ModifyOrder}>
            Modifier la commande
        </button>
    );

}


export default ModifyButton;
