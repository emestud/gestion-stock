import { useEffect, useState } from "react"
import store from "../../stores/store"

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
            <td>{date}</td>
            <td>{restaurantName}</td>
            <td>{restaurantAddress}</td>
            <td className="badge badge-primary badge-outline">{status}</td>
        </tr>
    )
}

export default OrderHistory