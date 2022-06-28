import Category from '../components/Order/Category'

import store from '../store'

const Order = () => {

    let listCategory = store.categories.map(category=>
        <li><Category categoryName={category.name} listItems={category.items} key={category.name}/></li>  
    )

    return (
        <div>
            <ol className="w-11/12 max-w-screen-md flex flex-col gap-8 pb-8">
                {listCategory}
            </ol>
        </div>
    )
}

export default Order