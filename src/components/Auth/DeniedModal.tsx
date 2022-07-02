import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import store from "../../stores/store"

const DeniedModal = () => {

    let [isAccessible, setIsAccessible] = useState(false)
    let role = store.user.role

    const updateIsAccessible = (role: string, path: string)=> {
        if (role === "Manager") {
            if (path === '/order' || path === '/history')
                setIsAccessible(true)
            else setIsAccessible(false)
        }
        else if (role === "Livreur") {
            if (path === '/delivery')
                setIsAccessible(true)
            else setIsAccessible(false)
        }
        else if (role === "Labo") {
            if (path === '/lab')
                setIsAccessible(true)
            else setIsAccessible(false)
        }
        else if (role === "Admin") {
            setIsAccessible(true)
        }
    }

    let location = useLocation()

    useEffect(()=>{
        updateIsAccessible(role, location.pathname)
    }, [location.pathname])



    return (
        <div className={`${isAccessible ? 'hidden' : 'fixed'}  w-screen h-screen bg-white opacity-80 backdroup-blur-lg flex justify-center items-center`}>
            <div className="bg-white text-xl p-8 rounded-xl">
                Votre rôle ({role}) ne vous permet pas d'accéder à cette page
            </div>
        </div>
    )
}

export default DeniedModal
