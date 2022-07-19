import store from "../../../stores/store"

const ModifyButton = (props:any) => {

    let {isOrdered, setIsOrdered, mode} = props;

    const ModifyOrder = () => {
        store.order.status = "On order";
        setIsOrdered(!isOrdered);
    }

    return (
        <button className="sticky top-[3%] sm:top-[2.5%] flex text-white justify-center ml-24 md:m-auto p-0 w-8/12 h-fit m-auto text-xl btn btn-warning 
                                md:w-2/3 lg:w-1/2 max-w-2xl"
                onClick={ModifyOrder}>
            Modifier {mode === 'Order' ? 'la commande' : 'les pertes'}
        </button>
    );

}


export default ModifyButton;
