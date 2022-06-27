const Categorie = (props: any) => {

    let { categoryName, listItems } = props

    let list = listItems.map((item:any) => 
        <li>{item}</li>
    )

    return (
        <>
            <h2>{categoryName}</h2>
            <ol>

            </ol>
        </>
    )

}


export default Categorie