import { NavLink } from "react-router-dom"

import { useState } from "react"


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

const NavBar = () => {

    const [isActive, setIsActive]:any = useState(false)

    return (
        <>
            <div className={`fixed h-screen bg-amber-100 w-5/6 duration-300 ${isActive ? 'md:w-1/2 lg:w-1/6': 'w-0'}`}>
                <Burger isActive={isActive} setIsActive={setIsActive}> </Burger>
                <ol className={`h-full w-full flex flex-col text-2xl justify-start items-center gap-10 pt-24 ${isActive ? '' : '-translate-x-20 opacity-0'}`}>
                    <NavLink className={({isActive})=> isActive ? 'underline' : ''} to="/">Commande</NavLink>
                    <NavLink className={({isActive})=> isActive ? 'underline' : ''} to="/history">Historique</NavLink>
                    <NavLink className={({isActive})=> isActive ? 'underline' : ''} to="/admin">Admin</NavLink>
                    <NavLink className={({isActive})=> isActive ? 'underline' : ''} to="/statistiques">Statistiques</NavLink>
                </ol>
            </div>
        </>
    )
}


export default NavBar