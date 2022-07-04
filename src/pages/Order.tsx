import Category from '../components/Order/Category'

import ModifyButton from '../components/Order/Buttons/ModifyButton'
import OrderButton from '../components/Order/Buttons/OrderButton'

import store from '../stores/store'
import { useState } from 'react'

const Order = () => {

    let listCategory = store.itemCategories.map(category=>
        <li><Category categoryName={category.name} listItems={category.items} key={category.name}/></li>
    )

    let [isOrdered, setIsOrdered] = useState(false)

    const updateComment = (event:any) => {
        store.updateOrderComment(event.target.value)
    }

    return (
        <div className='flex flex-col gap-8 pb-8 justify-center items-center'>
            <div className="w-11/12 max-w-4xl m-auto mb-8 p-2 rounded-lg flex gap-2 font-bold text-xl justify-center items-center border-2 border-solid border-black">
                <p>{store.date}</p>
                <p>|</p>
                <p>{store.restaurant.name}</p>
            </div>
            <ol className="w-11/12 max-w-screen-md flex flex-col gap-8">
                {listCategory}
            </ol>
            <textarea className="w-11/12 textarea textarea-accent max-w-3xl" placeholder='Un commentaire ?... 💬' onChange={updateComment}/>
            {isOrdered ? <ModifyButton isOrdered={isOrdered} setIsOrdered={setIsOrdered} /> : <OrderButton isOrdered={isOrdered} setIsOrdered={setIsOrdered} />}
        </div>
    );
}

export default Order;
