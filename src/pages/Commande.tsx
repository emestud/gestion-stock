import Categorie from '../components/Commande/Categorie'

import store from '../store'

const Commande = () => {

    let listCategory = store.categories.map(category=>
        <li><Categorie categoryName={category.name} listItems={category.items} key={category.name}/></li>  
    )

    return (
        <div>
            <ol className="w-11/12">
                {listCategory}
            </ol>
        </div>
    )
}

export default Commande