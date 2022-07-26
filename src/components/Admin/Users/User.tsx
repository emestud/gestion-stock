import {deleteUserByID} from '../../../databaseClient';
import {FullUser} from '../../../types';

interface UserProp {
  user: FullUser;
}

const User = ({user}: UserProp) => {
  const deleteUser = (userID: string) => {
    deleteUserByID(userID);
  };

  return (
    <>
      <tr>
        <td>{user.username}</td>
        <td>{user.role}</td>
        <td>{user.restaurant === null ? 'Aucun' : user.restaurant.name}</td>
        <td>
          <button
            className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
            onClick={() => deleteUser(user.id)}
          >
            Supprimer
          </button>
        </td>
      </tr>
    </>
  );
};

export default User;
