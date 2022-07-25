import {useEffect, useState} from 'react';
import {default as ItemComponent} from './Item';

import store from '../../stores/store';
import {Item} from '../../types';

interface CategoryProp {
  categoryName: string;
  isOrdered: boolean;
  isEditable: boolean;
}

const Category = (props: CategoryProp) => {
  const {categoryName, isOrdered, isEditable} = props;

  const [items, setItems] = useState<Array<Item>>([]);

  useEffect(() => {
    setItems(store.getItemsOfCategory(categoryName));
  }, []);

  const list = items.map((item: Item) => (
    <li key={item.name}>
      <ItemComponent
        id={item.id}
        name={item.name}
        containerProp={item.container}
        priority={item.orderPriority}
        quantityProp={item.quantity}
        isOrdered={isOrdered}
        isEditable={isEditable}
        item={item}
      />
    </li>
  ));

  return (
    <div>
      <h2 className="text-xl font-bold">{categoryName}</h2>
      <ol className="flex flex-col gap-1">{list}</ol>
    </div>
  );
};

export default Category;
