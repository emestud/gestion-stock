import Category from '../components/Order/Category'

import ModifyButton from '../components/Order/Buttons/ModifyButton'
import OrderButton from '../components/Order/Buttons/OrderButton'

import store from '../stores/store'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import Spinner from '../components/Misc/Spinner'
import GoBack from '../components/Misc/GoBack'

const Order = () => {

    const navigate = useNavigate();
    const location:any = useLocation();

    let [isOrdered, setIsOrdered] = useState(store.order.status!=="On order");
    let [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
    let [comment, setComment]:any = useState("");
    let [itemCategories, setItemCategories]:any = useState(store.itemCategories);
    let [modifiedItemCategories, setModifiedItemCategories]: any = useState(store.itemCategories);
    
    let [orderID, setOrderID]:any = useState(""); 

    let [isEditable, setIsEditable]: any = useState(true)

    let [dataLoading, setDataLoading]: any = useState(true);

    useEffect(()=>{
        if (store.user.role !== "Manager" && store.user.role !== "Admin") {
            navigate('/unauthorized');
        }
    }, [])

    if (location.state !== null) {
        useEffect(()=>{
            (async function awaitSetOrder() {

                setOrderID(location.state.order_id);

                const [order, lastModification]:any = await store.orderStore.getOrder(location.state.order_id);

                const itemCategories = await store.setOrder(location.state.order_id, true);                
                setItemCategories(itemCategories);

                if (lastModification !== undefined){
                    const modifiedItemCategories = await store.setOrder(lastModification.id, false);
                    setModifiedItemCategories(modifiedItemCategories);
                }

                setIsEditable(order.status === "On order" || order.status === "Ordered");
                setDataLoading(false);
            })();
        }, []);
    }
    else {
        useEffect(()=>{
            (async ()=>{
                await store.resetOrder();
                setDataLoading(false);
            })();
        }, []);
    }


    let listCategory = itemCategories.map((category:any, index:number)=>
        <li><Category categoryName={category.name} isOrdered={isOrdered} isEditable={isEditable} key={category.name}/></li>
    )

    const updateDate = (event: any) => {
        store.order.created_at = event.target.value;
        setDate(event.target.value);
    };

    const updateComment = (event: any) => {
        setComment(event.target.value);
        store.updateOrderComment(event.target.value, orderID);
    };


    return (
        <div className='flex flex-col gap-8 pb-8 justify-center items-center mt-20'>
            {dataLoading ? 
            (<Spinner />) 
            : 
            (<>
                <div className='w-full flex items-center justify-around max-w-screen-md'>
                    <GoBack />
                    <div className="w-10/12 max-w-4xl p-2 rounded-lg flex gap-2 font-bold text-xl justify-center items-center border-2 border-solid border-black">
                        <input type="date" className="w-fit" value={date} onChange={updateDate}></input>
                        <p>|</p>
                        <p className="">{store.restaurant.name}</p>
                    </div>
                </div>
                {isEditable ? 
                    isOrdered ? 
                        <ModifyButton isOrdered={isOrdered} setIsOrdered={setIsOrdered} /> : <OrderButton isOrdered={isOrdered} setIsOrdered={setIsOrdered} />
                    :
                    <div className='btn btn-disabled'>La commande a été praparée</div>
                }
                <ol className="w-11/12 max-w-screen-md flex flex-col gap-8">
                    {listCategory}
                </ol>
                <textarea className="w-11/12 textarea textarea-accent max-w-3xl" value={comment} placeholder='Un commentaire ?... 💬' onChange={updateComment} disabled={isOrdered}/>
            </>)}
        </div>
    );
}

export default Order;
