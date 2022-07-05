import store from "../stores/store";
import { useNavigate } from "react-router-dom";

const Delivery = () => {

    const navigate = useNavigate()

    if (store.user.role !== "Livreur" && store.user.role !== "Admin") {
        navigate('/unauthorized');
    }


    return (
        <div>Delivery</div>
    );
}

export default Delivery;