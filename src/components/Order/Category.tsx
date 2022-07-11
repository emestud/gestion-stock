import Item from './Item'

const Category = (props: any) => {

    let { categoryName, listItems, isOrdered, isEditable } = props;

    let list = listItems.map((item:any) => 
        <li key={item.name}>
            <Item id={item.id} name={item.name} containerProp={item.container} priority={item.priority} quantityProp={item.quantity} 
                    isOrdered={isOrdered} isEditable={isEditable} />
        </li>
    )

    return (
        <div>
            <h2 className="text-xl font-bold">{categoryName}</h2>
            <ol className="flex flex-col gap-1">
                {list}
            </ol>
        </div>
    );

}


export default Category;