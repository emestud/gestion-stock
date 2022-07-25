import {useState} from 'react';
import store from '../../stores/store';
import {Container} from '../../types';

const Item = (props: any) => {
  const {
    id,
    name,
    containerProp,
    quantityProp,
    priority,
    isOrdered,
    isEditable,
  } = props;

  const [quantity] = useState<number>(quantityProp);

  const [newQuantity, setNewQuantity] = useState<number>(quantityProp[1]);
  const [oldQuantity] = useState<number>(quantityProp[0]);
  const quantityDiff = newQuantity - oldQuantity;

  const [oldContainer] = useState<Container>(containerProp[0]);
  const [newContainer, setNewContainer] = useState<Container>(containerProp[1]);
  const containerChanged = oldContainer.name !== newContainer.name;

  /*const [numberInputIncorrect, setNumberInputIncorrect] =
    useState<boolean>(false);*/

  const handleQuantityChange = (newQuantityValue: number) => {
    const input = document.getElementById('quantityInput') as HTMLInputElement;

    if (isNaN(newQuantityValue)) {
      newQuantityValue = 0;
    }

    if (newQuantityValue < 0) {
      if (input !== null) {
        input.value = '0';
      }
      setNewQuantity(0);
      return;
    }

    setNewQuantity(newQuantityValue);

    if (newQuantity !== 0) {
      store.updateOrder(name, newQuantityValue, {
        name: newContainer.name,
        id: newContainer.id,
      });
    }
  };

  const handleContainerChange = (newContainerValue: string) => {
    setNewContainer({
      id: newContainer.id,
      name: newContainerValue,
    });

    if (quantity !== 0) {
      store.updateOrder(name, newQuantity, {
        name: newContainerValue,
        id: newContainer.id,
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
        placeholder={newQuantity.toString()}
        onChange={event => handleQuantityChange(parseInt(event.target.value))}
      />
    </div>
  );
};

export default Item;
