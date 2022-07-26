import store from '../stores/store';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';

import Containers from '../components/Admin/Containers/Containes';
import Products from '../components/Admin/Products/Prodcuts';
import Users from '../components/Admin/Users/Users';
import Restaurants from '../components/Admin/Restaurants/Restaurants';

const Admin = () => {
  const navigate = useNavigate();

  if (store.user.role !== 'Admin') {
    navigate('/unauthorized');
  }

  const [currentTab, setCurrentTab] = useState('users');

  let currentActiveTab;

  switch (currentTab) {
    case 'users':
      currentActiveTab = <Users />;
      break;
    case 'products':
      currentActiveTab = <Products />;
      break;
    case 'containers':
      currentActiveTab = <Containers />;
      break;
    case 'restaurants':
      currentActiveTab = <Restaurants />;
      break;
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-center text-2xl font-bold underline my-12">Admin</h1>
      <div>
        <div className="flex m-auto w-10/12 tabs">
          <a
            className={`w-1/4 tab tab-bordered ${
              currentTab === 'users' ? 'tab-active' : ''
            }`}
            onClick={() => setCurrentTab('users')}
          >
            Utilisateurs
          </a>
          <a
            className={`w-1/4 tab tab-bordered ${
              currentTab === 'products' ? 'tab-active' : ''
            }`}
            onClick={() => setCurrentTab('products')}
          >
            Produits
          </a>
          <a
            className={`w-1/4 tab tab-bordered ${
              currentTab === 'containers' ? 'tab-active' : ''
            }`}
            onClick={() => setCurrentTab('containers')}
          >
            Récipients
          </a>
          <a
            className={`w-1/4 tab tab-bordered ${
              currentTab === 'restaurants' ? 'tab-active' : ''
            }`}
            onClick={() => setCurrentTab('restaurants')}
          >
            Restaurants
          </a>
        </div>
      </div>
      <div className="w-10/12 m-auto">{currentActiveTab}</div>
    </div>
  );
};

export default Admin;
