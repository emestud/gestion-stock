import {useState} from 'react';
import store from '../../stores/store';
import {Container} from '../../types';

const Item = (props: any) => {
  const {name, containerProp, quantityProp, isOrdered, isEditable} = props;

  const [quantity] = useState<number>(quantityProp);

  const [newQuantity, setNewQuantity] = useState<string>(quantityProp[1]); // text is easier to manipulate for the input
  const [oldQuantity] = useState<number>(quantityProp[0]);
  const quantityDiff = parseInt(newQuantity) - oldQuantity;

  const [oldContainer] = useState<Container>(containerProp[0]);
  const [newContainer, setNewContainer] = useState<Container>(containerProp[1]);
  const containerChanged = oldContainer.name !== newContainer.name;

  const handleQuantityChange = (newQuantityValue: string) => {
    let value = newQuantityValue.replace(/[^0-9]+/g, '');

    if (isNaN(parseInt(value))) {
      value = '0';
    }

    setNewQuantity(value);

    if (value !== '0') {
      store.updateOrder(name, parseInt(value), {
        name: newContainer.name,
        id: newContainer.id,
      });
    } else if (value === '0' && oldQuantity !== 0) {
      store.updateOrder(name, parseInt(value), {
        name: newContainer.name,
        id: newContainer.id,
      });
    }
  };

  const handleContainerChange = (newContainerValue: string) => {
    const containerID = store.getContainerIDByName(newContainerValue);

    setNewContainer({
      id: containerID,
      name: newContainerValue,
    });

    if (quantity !== 0) {
      store.updateOrder(name, parseInt(newQuantity), {
        name: newContainerValue,
        id: containerID,
      });
    }
  };

  return (
    <div className="flex justify-center gap-1">
      <p className="w-1/3 flex justify-center items-center text-center border border-solid border-slate-300 rounded-lg">
        {name}
      </p>
      <select
        className={`w-1/3 select select-bordered ${
          containerChanged ? 'bg-yellow-300' : ''
        }`}
        name="Container"
        id="container-select"
        defaultValue={newContainer.name}
        onChange={event => handleContainerChange(event.target.value)}
        disabled={isOrdered || !isEditable}
      >
        {store.containerCategories.map(category => (
          <optgroup label={category.name}>
            {category.containers.map(container => (
              <option value={container.name}>{container.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
      <input
        id="quantityInput"
        className={`w-3/12 input input-bordered 
                                ${
                                  quantityDiff > 0
                                    ? 'bg-green-300'
                                    : quantityDiff < 0
                                    ? 'bg-red-500'
                                    : ''
                                }`}
        type="number"
        min="0"
        disabled={isOrdered || !isEditable}
        placeholder={newQuantity}
        onChange={event => handleQuantityChange(event.target.value)}
      />
    </div>
  );
};

export default Item;
