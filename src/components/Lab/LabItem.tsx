import {useState} from 'react';

function quantityBgDiffColor(
  originalQuantities: Array<any>,
  modifiedQuantities: Array<any>,
  index: number
) {
  if (originalQuantities[index].quantity < modifiedQuantities[index].quantity) {
    return 'bg-green-300';
  } else if (
    originalQuantities[index].quantity > modifiedQuantities[index].quantity
  ) {
    return 'bg-red-500';
  } else {
    return '';
  }
}

function containerBgDiffColor(
  originalContainers: Array<any>,
  modifiedContainers: Array<any>,
  index: number
) {
  if (
    originalContainers[index].container !== modifiedContainers[index].container
  ) {
    return 'bg-yellow-300';
  } else {
    return '';
  }
}

const LabItem = ({items, addItemToCancel}: any) => {
  const [isCanceled, setIsCanceled] = useState<boolean>(items.canceledByLab);

  for (let i = 0; i < items.containers.length; i++) {
    items.containers[i] = items.containers[i].sort(
      (containerA: any, containerB: any) => {
        return containerA.restaurant.localeCompare(containerB.restaurant);
      }
    );
  }

  for (let i = 0; i < items.quantities.length; i++) {
    items.quantities[i] = items.quantities[i].sort(
      (quantityA: any, quantityB: any) => {
        return quantityA.restaurant.localeCompare(quantityB.restaurant);
      }
    );
  }

  const cancelItems = () => {
    const item_ids: Array<string> = [];

    for (const itemsOfRestauraurants of items.quantities) {
      for (const item of itemsOfRestauraurants) {
        if (item.item_order_id !== undefined) {
          item_ids.push(item.item_order_id);
        }
      }
    }

    addItemToCancel(!isCanceled, item_ids);
    setIsCanceled(!isCanceled);
  };

  return (
    <>
      <tr>
        <td>{items.name}</td>
        {items.quantities[1].map((quantity: any, index: number) => (
          <>
            <td
              className={`${quantityBgDiffColor(
                items.quantities[0],
                items.quantities[1],
                index
              )} 
                text-center select-none px-0`}
            >
              {quantity.quantity !== 0 ? quantity.quantity : ''}
            </td>
            <td
              className={`${containerBgDiffColor(
                items.containers[0],
                items.containers[1],
                index
              )} 
                                            text-center select-none px-0`}
            >
              {items.containers[1][index].container !== 'Aucun'
                ? items.containers[1][index].container
                : ''}
            </td>
          </>
        ))}
        <td>
          <input
            type="checkbox"
            className="checkbox"
            onChange={() => cancelItems()}
            checked={isCanceled}
          />
        </td>
      </tr>
    </>
  );
};

export default LabItem;
