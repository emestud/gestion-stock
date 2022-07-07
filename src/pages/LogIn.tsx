import LogInModal from "../components/Auth/LogInModal"

const LogIn = ({setLogIn}:any) => {

    return (
        <div>
            <LogInModal setLogIn={setLogIn} />
        </div>
    )
}

export default LogIn