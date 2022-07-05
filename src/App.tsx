import { Routes, Route } from 'react-router-dom';

import NavBar from "./components/Navbar";

import Admin from './pages/Admin';

import Order from './pages/Order';
import Lab from './pages/Lab';
import Delivery from './pages/Delivery';

import History from './pages/History';
import Statistiques from './pages/Statistiques';
import Unauthorized from './pages/Unauthorized';

import LogInModal from './components/Auth/LogInModal';

import store from './stores/store';
import { useState } from 'react';

const App = () => {

  let [isLoggedIn, setIsLoggedIn] = useState(store.isLoggedIn);

  const setLogIn = (user: any) => {
    setIsLoggedIn(true);
    store.logIn(user);
  }

  const setLogOut = () => {
    setIsLoggedIn(false);
    store.logOut();
  }

  return (
    <div>
      <NavBar setLogOut={setLogOut} />
      {isLoggedIn ? <></> : <LogInModal setLogIn={setLogIn} />  }
      <main className="pt-20 h-screen w-screen overflow-scroll">
        <Routes>
          <Route path="order" element={ <Order /> }></Route>
          <Route path="lab" element={ <Lab /> }></Route>
          <Route path="delivery" element={ <Delivery /> }></Route>
          <Route path="admin" element={ <Admin /> }></Route>
          <Route path="/" element={ <History /> }></Route>
          <Route path="statistiques" element={ <Statistiques /> }></Route>
          <Route path="unauthorized" element={ <Unauthorized /> }></Route>
        </Routes>
      </main>
    </div>
  )
}

export default App
