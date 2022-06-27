import { Routes, Route } from 'react-router-dom'

import NavBar from "./components/Navbar"

import Admin from './pages/Admin'
import Commande from './pages/Commande'
import Historique from './pages/Historique'
import Statistiques from './pages/Statistiques'

const App = () => {

  return (
    <div>
      <NavBar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={ <Commande /> }></Route>
          <Route path="admin" element={ <Admin /> }></Route>
          <Route path="historique" element={ <Historique /> }></Route>
          <Route path="statistiques" element={ <Statistiques /> }></Route>
        </Routes>
      </main>
    </div>
  )
}

export default App
