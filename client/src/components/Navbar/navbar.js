import { useContext } from 'react';
import './navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../Context/authContext';
import { baseURL } from '../../baseURL/baseURL';
import useFetch from '../../hooks/useFetch';
import { clearAccessToken } from '../../shared/auth/tokenStorage';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const profileUrl = user?._id ? `${baseURL}/user/profile/${user._id}` : null;
  const { data, error } = useFetch(profileUrl);
  // console.log(error);
  // console.log(user);
  if (error || !user) {
    dispatch({ type: "LOGOUT" });
    clearAccessToken();
    navigate('/login');
    return;
  }
  return (
    <div className='navbar'>
      <div className='navbarContainer'>
        <Link to='/' className='logo'>HotelBook.com</Link>
        <div className='navItems'>
          {error && <>
            <Link to='/signUp' className='navButton'>Register</Link>
            <Link to='/login' className='navButton'>Login</Link>
          </>
          }
          {data && !error && <Link to={`/user/${data._id}`} className='navButton-userLogo'>
            <img
              className='userLogoButton'
              src={data.profilePicture}
              alt='' />
          </Link>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
