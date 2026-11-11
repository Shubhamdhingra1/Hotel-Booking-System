import { useContext, useEffect } from 'react';
import './navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../Context/authContext';
import { clearAccessToken } from '../../shared/auth/tokenStorage';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (!user.isAdmin) {
      clearAccessToken();
      dispatch({ type: "LOGOUT" });
      navigate('/login', { replace: true });
    }
  }, [user, dispatch, navigate]);

  if (!user?.isAdmin) {
    return null;
  }

  const profilePicture = user.profilePicture;
  const userId = user._id;

  return (
    <div className='navbar'>
      <div className='navbarContainer'>
        <Link to='/' className='logo'>HotelBook.com</Link>
        <div className='navItems'>
          {userId && (
            <Link to={`/admin/${userId}`} className='navButton-userLogo'>
              {profilePicture ? (
                <img
                  className='userLogoButton'
                  src={profilePicture}
                  alt=''
                />
              ) : (
                <span className='navButton'>Profile</span>
              )}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
