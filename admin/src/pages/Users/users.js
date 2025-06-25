import { Link } from 'react-router-dom';
import { baseURL } from '../../baseURL/baseURL';
import Header from '../../components/Header/header';
import Navbar from '../../components/Navbar/navbar';
import useFetch from '../../hooks/useFetch';
import './users.css';

const Users = () => {
    const { data } = useFetch(`${baseURL}/user/${localStorage.getItem('access_token')}`);

    return (
        <div className='user-page'>
            <Navbar />
            <Header />
            <div className='users-container-wrapper'>
                <div className='users-container'>
                    {
                        data.map(user => (
                            <Link to={`/user/${user._id}`} className='user-card' key={user._id}>
                                <div className='user-image-wrapper'>
                                    {user.profilePicture ? <img
                                        className='user-image'
                                        src={user.profilePicture}
                                        alt='' /> :
                                        <p className='user-image'>No picture</p>
                                    }
                                </div>
                                <p>{user.username}</p>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Users