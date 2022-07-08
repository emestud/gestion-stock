import Category from '../components/Order/Category'

import ModifyButton from '../components/Order/Buttons/ModifyButton'
import OrderButton from '../components/Order/Buttons/OrderButton'

import store from '../stores/store'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Order = () => {

    const navigate = useNavigate();
    const location:any = useLocation();

    let [isOrdered, setIsOrdered] = useState(store.order.status!=="On order");
    let [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
    let [comment, setComment]:any = useState("");
    let [itemCategories, setItemCategories]:any = useState(store.itemCategories);

    useEffect(()=>{
        if (store.user.role !== "Manager" && store.user.role !== "Admin") {
            navigate('/unauthorized');
        }
    }, [])

    if (location.state !== null) {
        let orderID:string = location.state.order_id;
        useEffect(()=>{
            (async function awaitSetOrder() {
                const itemCategories = await store.setOrder(orderID);
                setItemCategories(itemCategories);
                console.log("order set");
            })();
        }, []);
    }
    else {
        useEffect(()=>{
            store.resetOrder();
        }, []);
    }


    let listCategory = itemCategories.map((category:any)=>
        <li><Category categoryName={category.name} listItems={category.items} isOrdered={isOrdered} key={category.name}/></li>
    )

    const updateDate = (event: any) => {
        store.order.created_at = event.target.value;
        setDate(event.target.value);
    };

    const updateComment = (event: any) => {
        setComment(event.target.value);
        store.updateOrderComment(event.target.value);
    };


    return (
        <div className='flex flex-col gap-8 pb-8 justify-center items-center mt-20'>
            <div className="w-11/12 max-w-4xl m-auto mb-8 p-2 rounded-lg flex gap-2 font-bold text-xl justify-center items-center border-2 border-solid border-black">
                <input type="date" className="w-1/2" value={date} onChange={updateDate} disabled></input>
                <p>|</p>
                <p className="w-1/2">{store.restaurant.name}</p>
            </div>
            <ol className="w-11/12 max-w-screen-md flex flex-col gap-8">
                {listCategory}
            </ol>
            <textarea className="w-11/12 textarea textarea-accent max-w-3xl" value={comment} placeholder='Un commentaire ?... 💬' onChange={updateComment} disabled={isOrdered}/>
            {isOrdered ? <ModifyButton isOrdered={isOrdered} setIsOrdered={setIsOrdered} /> : <OrderButton isOrdered={isOrdered} setIsOrdered={setIsOrdered} />}
        </div>
    );
}

export default Order;
