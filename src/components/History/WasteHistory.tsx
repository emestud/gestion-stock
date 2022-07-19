import { useEffect, useState } from "react"
import store from "../../stores/store"

const WasteHistory = ({date, restaurant_id, openWaste}:any) => {
    
    const [restaurantName, setRestaurantName] = useState("");

    useEffect(()=>{
        (async () => {
            let tmp:any = await store.getRestaurantData(restaurant_id);
            
            if (tmp !== null) {
                setRestaurantName(tmp[0].name);
            }
        })();
    }, [])


    return (
        <tr onClick={openWaste}>
            <td className="select-none">{date}</td>
            <td className="select-none">{restaurantName}</td>
            <td className={`badge badge-ghost} badge-outline select-none`}>---</td>
        </tr>
    )
}

export default WasteHistory