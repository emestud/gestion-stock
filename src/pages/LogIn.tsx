import LogInModal from '../components/Auth/LogInModal';
import {User} from '../types';

interface LogInProp {
  setLogIn: (user: User) => void;
}

const LogIn = ({setLogIn}: LogInProp) => {
  return (
    <div>
      <LogInModal setLogIn={setLogIn} />
    </div>
  );
};

export default LogIn;
