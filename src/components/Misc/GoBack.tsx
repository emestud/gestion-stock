import LeftArrow from '../../assets/arrow-left.png';

import {useNavigate} from 'react-router-dom';

const GoBack = () => {
  const navigate = useNavigate();

  return (
    <img
      className="cursor-pointer"
      src={LeftArrow}
      alt="go back arrow"
      onClick={() => navigate(-1)}
    />
  );
};

export default GoBack;
