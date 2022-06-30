import { Routes, Route, useLocation } from 'react-router-dom'

import NavBar from "./components/Navbar"

import Admin from './pages/Admin'

import Order from './pages/Order'
import Lab from './pages/Lab'
import Delivery from './pages/Delivery'

import History from './pages/History'
import Statistiques from './pages/Statistiques'

import LogInModal from './components/Auth/LogInModal'
import DeniedModal from './components/Auth/DeniedModal'

import store from './store'
import { useState } from 'react'

const App = () => {

  let [isLoggedIn, setIsLoggedIn] = useState(store.isLoggedIn)

  const setLogIn = (user: any) => {
    setIsLoggedIn(true)
    store.logIn(user)
  }

  const setLogOut = () => {
    setIsLoggedIn(false)
    store.logOut()
  } 

  return (
    <div>
      <NavBar setLogOut={setLogOut} />
      {isLoggedIn ? <></> : <LogInModal setLogIn={setLogIn} />  }
      <DeniedModal />
      <main className="pt-20">
        <Routes>
          <Route path="/order" element={ <Order /> }></Route>
          <Route path="/lab" element={ <Lab /> }></Route>
          <Route path="/delivery" element={ <Delivery /> }></Route>
          <Route path="admin" element={ <Admin /> }></Route>
          <Route path="history" element={ <History /> }></Route>
          <Route path="statistiques" element={ <Statistiques /> }></Route>
        </Routes>
      </main>
    </div>
  )
}

export default App
