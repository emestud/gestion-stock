import store from "../stores/store";
import { useNavigate } from "react-router-dom";

const Admin = () => {

    const navigate = useNavigate()

    if (store.user.role !== "Admin") {
        navigate('/unauthorized');
    }


    return (
        <>
            <h1>Admin</h1>
        </>
    );
}

export default Admin;