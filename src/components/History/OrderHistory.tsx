import { useEffect, useState } from "react"
import store from "../../stores/store"
import { Status } from "../../types"

const getStatusText = (status: Status) => {

    switch (status) {
        case 'On order':
            return "En commande";
        case 'Ordered':
            return 'Commandée';
        case 'Prepared':
            return 'Préparée';
        case 'Delivered':
            return 'Livrée';
    }

}

const getBadgeColor = (status: Status) => {

    switch (status) {
        case 'On order':
            return "neutral";
        case 'Ordered':
            return 'primary';
        case 'Prepared':
            return 'secondary';
        case 'Delivered':
            return 'accent';
    }

}

const OrderHistory = ({date, restaurant_id, status, isActive, updateActiveTab}:any) => {
    
    const [restaurantName, setRestaurantName] = useState("")
    const [restaurantAddress, setRestaurantAdress] = useState("")

    useEffect(()=>{
        (async () => {
            let tmp:any = await store.getRestaurantData(restaurant_id);
            
            if (tmp !== null) {
                setRestaurantName(tmp[0].name);
                setRestaurantAdress(tmp[0].address)
            }
        })();
    }, [])


    return (
        <tr className={`${isActive ? 'active' : ''}`} onClick={updateActiveTab}>
            <td className="select-none">{date}</td>
            <td className="select-none">{restaurantName}</td>
            <td className={`badge badge-${getBadgeColor(status)} badge-outline select-none`}>{getStatusText(status)}</td>
        </tr>
    )
}

export default OrderHistory