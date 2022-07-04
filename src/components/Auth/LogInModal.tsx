import { useState } from "react"
import { logIn } from "../../supabaseClient"

const LogInModal = ({ setLogIn }:any) => {


    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [errorMessage, setErrorMessage] = useState("");


    const updateUsername = (event: any) => {
        setUsername(event.target.value);
    }

    const updatePassword = (event: any) => {
        setPassword(event.target.value);
    }

    const tryLogIn = async (username: string, password: string) => {

        let [user, error] = await logIn(username, password);
        
        if (error === "") { // login is successful
            setErrorMessage("");
            setLogIn(user);
        }
        else { // login is not successful
            console.log(error);
            setErrorMessage(error);
        }

    }

    return (
        <div className="fixed w-screen h-screen text-xl flex justify-center z-20">
            <div className="absolute w-full h-full bg-black opacity-80"></div>
            <form className="absolute flex flex-col bg-white w-10/12 mx-auto h-5/6 my-[5%] p-4 pt-24 gap-16 max-w-4xl items-center rounded-3xl" 
                onSubmit={e => e.preventDefault()}
            >
                <input className="w-full sm:w-1/2 border-dotted border border-black p-2" type="text" placeholder="Username" onChange={updateUsername}/>
                <input className="w-full sm:w-1/2 border-dotted border border-black p-2" type="text" placeholder="Password" onChange={updatePassword}/>
                <button className="w-full sm:w-1/2 shadow-2xl text-2xl p-4 border border-solid border-black" 
                        onClick={()=>tryLogIn(username, password)}>
                            Log-In
                </button>
                <p className={`w-full sm:w-1/2 p-4 border border-red-500 border-solid text-center ${errorMessage==="" ? 'hidden' : 'block'}`}>{errorMessage}</p>
            </form>
        </div>
    );
}


export default LogInModal;