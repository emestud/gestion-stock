import { useState } from "react"
import store from "../../store"
import { logIn } from "../../supabaseClient"

const LogInModal = ({ setLogIn }:any) => {


    let [username, setUsername] = useState("")
    let [password, setPassword] = useState("")
    let [errorMessage, setErrorMessage] = useState("")


    const updateUsername = (event: any) => {
        setUsername(event.target.value)
    }

    const updatePassword = (event: any) => {
        setPassword(event.target.value)
    }

    const tryLogIn = async (username: string, password: string) => {

        let [user, error] = await logIn(username, password)
        
        if (error === "") { // login is successful
            setErrorMessage("")
            setLogIn(user)
        }
        else { // login is not successful
            console.log(error)
            setErrorMessage(error)
        }

    }

    return (
        <div className="fixed w-screen h-screen text-xl">
            <div className="absolute w-full h-full z-10 bg-black"></div>
            <form className="absolute bg-white z-20 w-10/12 m-[8.8%] h-5/6 flex flex-col p-4 gap-8" onSubmit={e => e.preventDefault()}>
                <input type="text" placeholder="Username" onChange={updateUsername}/>
                <input type="text" placeholder="Password" onChange={updatePassword}/>
                <button onClick={()=>tryLogIn(username, password)}>Log-In</button>
                <p className={`p-4 border border-red-500 border-solid text-center ${errorMessage==="" ? 'hidden' : 'block'}`}>{errorMessage}</p>
            </form>
        </div>
    )
}


export default LogInModal