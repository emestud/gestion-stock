import { Routes, Route } from 'react-router-dom'

import NavBar from "./components/Navbar"

import Admin from './pages/Admin'
import Order from './pages/Order'
import History from './pages/History'
import Statistiques from './pages/Statistiques'

const App = () => {

  return (
    <div>
      <NavBar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={ <Order /> }></Route>
          <Route path="admin" element={ <Admin /> }></Route>
          <Route path="history" element={ <History /> }></Route>
          <Route path="statistiques" element={ <Statistiques /> }></Route>
        </Routes>
      </main>
    </div>
  )
}

export default App
