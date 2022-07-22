const sortByCategory = (items: Array<any>) => {
  const itemsSortedByCategory: Array<Array<any>> = [];
  let itemsCurrentCategory: Array<any> = [];
  let currentCategory: string = items[0].itemCategory;

  for (const item of items) {
    if (item.itemCategory === currentCategory) {
      itemsCurrentCategory.push(item);
    } else {
      itemsSortedByCategory.push(itemsCurrentCategory);
      itemsCurrentCategory = [item];
      currentCategory = item.itemCategory;
    }
  }
  itemsSortedByCategory.push(itemsCurrentCategory);

  return itemsSortedByCategory;
};

const RestaurantDelivery = ({restaurant_items}: any) => {
  const itemsSortedByCategory = sortByCategory(restaurant_items);

  return (
    <>
      <ol className="flex flex-col gap-2 w-full">
        {itemsSortedByCategory.map((category: any) => (
          <li
            key={category.categoryName}
            className="card card-bordered p-2 bg-slate-100"
          >
            <h2 className="card-title">{category[0].itemCategory}</h2>
            <ol className="card-body flex flex-col px-0 py-4">
              {category.map((item: any) => (
                <div className="flex select-none gap-1">
                  <p className="w-5/12 truncate">{item.name}</p>
                  <p className="w-2/12 truncate">{item.quantity}</p>
                  <p className="w-5/12 truncate">{item.container}</p>
                </div>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </>
  );
};

export default RestaurantDelivery;
