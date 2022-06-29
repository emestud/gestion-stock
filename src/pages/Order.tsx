import Category from '../components/Order/Category'

import CancelButton from '../components/Order/Buttons/CancelButton'
import OrderButton from '../components/Order/Buttons/OrderButton'

import store from '../store'
import { useState } from 'react'

const Order = () => {

    let listCategory = store.categories.map(category=>
        <li><Category categoryName={category.name} listItems={category.items} key={category.name}/></li>  
    )
    
    let [isOrdered, setIsOrdered] = useState(false)

    console.log(store.orderStatus)

    return (
        <div className='flex flex-col gap-8 pb-8'>
            <div className="w-fit m-auto mb-8 p-2 rounded-lg flex gap-2 font-bold text-xl justify-center items-center border-2 border-solid border-black">
                <p>{store.date}</p>
                <p>|</p>
                <p>{store.restaurant}</p>
            </div>
            <ol className="w-11/12 max-w-screen-md flex flex-col gap-8">
                {listCategory}
            </ol>
            {isOrdered ? <OrderButton isOrdered={isOrdered} setIsOrdered={setIsOrdered} /> : <CancelButton isOrdered={isOrdered} setIsOrdered={setIsOrdered} />}
        </div>
    )
}

export default Order