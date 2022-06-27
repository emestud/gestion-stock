const Categorie = (props: any) => {

    let { categoryName, listItems } = props

    let list = listItems.map((item:any) => 
        <li key={item.name}>
            <div className="flex justify-center">
                <p className="w-1/3 border border-black border-solid">{item.name}</p>
                <input className="w-1/3 border border-black border-solid" type="number"/>
                <select className="w-1/3 border border-black border-solid" name="" id="">
                    <option value="">Grand Bac 1/1</option>
                    <option value="">Sachet</option>
                    <option value="">Barquette</option>
                </select>
            </div>
        </li>
    )

    return (
        <div className="ml-5">
            <h2 className="text-xl font-bold">{categoryName}</h2>
            <ol>
                {list}
            </ol>
        </div>
    )

}


export default Categorie