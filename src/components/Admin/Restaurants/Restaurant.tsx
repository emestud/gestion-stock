import {deleteRestaurantByID} from '../../../databaseClient';
import {Restaurant as RestaurantType} from '../../../types';

interface RestaurantProp {
  restaurant: RestaurantType;
}

const Restaurant = ({restaurant}: RestaurantProp) => {
  const deleteRestaurant = (userID: string) => {
    deleteRestaurantByID(userID);
  };

  return (
    <>
      <tr>
        <td>{restaurant.name}</td>
        <td>{restaurant.address}</td>
        <td>
          <button
            className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
            onClick={() => deleteRestaurant(restaurant.id)}
          >
            Supprimer
          </button>
        </td>
      </tr>
    </>
  );
};

export default Restaurant;
