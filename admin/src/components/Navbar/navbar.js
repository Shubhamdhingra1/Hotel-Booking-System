import { useContext } from 'react';
import './navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../Context/authContext';
import { baseURL } from '../../baseURL/baseURL';
import useFetch from '../../hooks/useFetch';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const { data, error } = useFetch(`${baseURL}/user/userInfo/${localStorage.getItem("access_token")}/${user?._id}`);
  // console.log(error);
  // console.log(user);
  if (!user?.isAdmin ||error || !user) {
    dispatch({ type: "LOGOUT" });
    localStorage.setItem("access_token", null);
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
          {data && !error && <Link to={`/admin/${data._id}`} className='navButton-userLogo'>
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
