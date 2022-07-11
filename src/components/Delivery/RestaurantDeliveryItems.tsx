import { Item } from "../../types"

const sortByCategory = (items: Array<any>) => {

    let itemsSortedByCategory:Array<Array<any>> = [];
    let itemsCurrentCategory:Array<any> = [];
    let currentCategory: string = items[0].itemCategory;

    for (const item of items) {
        if (item.itemCategory === currentCategory) {
            itemsCurrentCategory.push(item);
        }
        else {
            itemsSortedByCategory.push(itemsCurrentCategory);
            itemsCurrentCategory = [item];
            currentCategory = item.itemCategory;
        }
    }
    itemsSortedByCategory.push(itemsCurrentCategory);

    return itemsSortedByCategory;

}


const RestaurantDelivery = ({restaurant_items}:any) => {

    let itemsSortedByCategory = sortByCategory(restaurant_items);

    return (
        <>
            <ol className="flex flex-col gap-2">
                {
                    itemsSortedByCategory.map((category:any)=>
                        <li key={category.categoryName} className="card card-bordered p-2 bg-slate-100">
                            <h2 className="card-title">{category[0].itemCategory}</h2>
                            <ol className="card-body flex flex-col">
                                {
                                    category.map((item:any)=>
                                        <p>
                                            {`${item.itemName} - ${item.quantity} - ${item.containerName}`}
                                        </p>
                                    )
                                }
                            </ol>
                        </li>
                    )
                }
            </ol>
        </>
    )
}


export default RestaurantDelivery