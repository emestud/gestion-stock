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

const OrderHistory = ({date, restaurantName, status, openOrder}:any) => {

    return (
        <tr onClick={openOrder}>
            <td className="select-none">{date}</td>
            <td className="select-none">{restaurantName}</td>
            <td className={`badge badge-${getBadgeColor(status)} badge-outline select-none`}>{getStatusText(status)}</td>
        </tr>
    )
}

export default OrderHistory