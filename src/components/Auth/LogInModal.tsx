import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { logIn } from "../../databaseClient"

const LogInModal = ({ setLogIn }:any) => {


    let [username, setUsername] = useState<string>("");
    let [password, setPassword] = useState<string>("");
    let [errorMessage, setErrorMessage] = useState<string>("");
    
    let navigate = useNavigate();

    const updateUsername = (event: any) => {
        setUsername(event.target.value);
    }

    const updatePassword = (event: any) => {
        setPassword(event.target.value);
    }

    const tryLogIn = async (username: string, password: string) => {

        if (username.length === 0 || password.length === 0) return; // if either is empty, there is no need to check

        let [user, error] = await logIn(username, password);
        
        if (error === "") { // login is successful
            setErrorMessage("");
            setLogIn(user);
            navigate('/');



        }
        else { // login is not successful
            console.log(error);
            setErrorMessage(error);
        }

    }

    return (
        <div className="fixed w-screen h-screen text-xl flex justify-center z-50">
            <div className="absolute w-full h-full bg-black opacity-80"></div>
            <form className="absolute flex flex-col bg-white w-10/12 mx-auto h-5/6 my-[5%] p-4 pt-24 gap-16 max-w-4xl items-center rounded-3xl overflow-y-scroll" 
                onSubmit={e => e.preventDefault()}
            >
                <input className="w-full sm:w-1/2 input input-bordered min-h-12" type="text" placeholder="Utilisateur" onChange={updateUsername}/>
                <input className="w-full sm:w-1/2 input input-bordered min-h-12" type="password" placeholder="Mot de passe" onChange={updatePassword}/>
                <button className="w-full sm:w-1/2 btn btn-outline btn-primary" 
                        onClick={()=>tryLogIn(username, password)}>
                            Se connecter
                </button>
                <div className={`w-full sm:w-1/2 alert alert-error ${errorMessage==="" ? 'hidden' : 'block'} shadow-lg flex flex-row`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{errorMessage}</span>
                </div>
            </form>
        </div>
    );
}


export default LogInModal;