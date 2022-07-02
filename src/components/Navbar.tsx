import { NavLink } from "react-router-dom"

import { useState } from "react"
import store from "../stores/store"


const Burger = (props: any) => {

    let { isActive, setIsActive } = props

    return (
        <div className={`flex flex-col w-16 gap-2 mt-6 ml-6 p-4 duration-300 ${isActive? 'bg-amber-100' : 'bg-white' }`} onClick={()=>setIsActive(!isActive)}>
            <div className={`w-8 h-0.5 bg-black duration-300 ${isActive ? 'rotate-45 translate-y-2.5' : ''}`}></div>
            <div className={`w-8 h-0.5 bg-black duration-300 ${isActive ? '-translate-x-20 opacity-0' : ''}`}></div>
            <div className={`w-8 h-0.5 bg-black duration-300 ${isActive ? '-rotate-45 -translate-y-2.5' : ''}`}></div>
        </div>
    )
}

const NavBar = ({setLogOut}:any) => {

    const [isActive, setIsActive]:any = useState(false)

    let userMainPageLink = (() => {
        if (store.user.role === 'Manager')
            return <NavLink className={({isActive})=> isActive ? 'underline' : ''} to="/order">Commande</NavLink>
        else if (store.user.role === 'Labo')
            return <NavLink className={({isActive})=> isActive ? 'underline' : ''} to="/lab">Labo</NavLink>
        else if (store.user.role === 'Livreur')
            return <NavLink className={({isActive})=> isActive ? 'underline' : ''} to="/delivery">Livraison</NavLink>
    });

    return (
        <>
            <div className={`fixed z-10 h-screen bg-amber-100 w-5/6 duration-300 ${isActive ? 'md:w-1/2 lg:w-1/6': 'w-0'}`}>
                <Burger isActive={isActive} setIsActive={setIsActive}> </Burger>
                <ol className={`h-full w-full flex flex-col text-2xl justify-start items-center gap-10 pt-24 ${isActive ? '' : '-translate-x-20 opacity-0'}`}>
                    <li>{userMainPageLink()}</li>
                    <li><NavLink className={({isActive})=> isActive ? 'underline' : ''} to="/history">Historique</NavLink></li>
                    <li><NavLink className={({isActive})=> isActive ? 'underline' : ''} to="/admin">Admin</NavLink></li>
                    <li><NavLink className={({isActive})=> isActive ? 'underline' : ''} to="/statistiques">Statistiques</NavLink></li>
                    <li><a className="cursor-pointer" onClick={()=>{setLogOut(); setIsActive(false)}}>Deconnexion</a></li>
                </ol>
            </div>
        </>
    )
}


export default NavBar
