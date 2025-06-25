import { useContext, useState } from 'react';
import './signUp.css';
import axios from 'axios';
import { baseURL } from '../../baseURL/baseURL';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../Context/authContext';
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from '../../components/GoogleAuth/googleAuth';
import { signInWithPopup } from "firebase/auth";

const SignUp = () => {
    const [signupData, setSignupData] = useState({
        username: '',
        email: '',
        password: '',
        profilePicture:'https://yt3.ggpht.com/a/AATXAJwFy0FRrVodxUiLPk3ldEEYFjjzpUDV2FeGAw=s900-c-k-c0xffffffff-no-rj-mo',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const navigate = useNavigate();
    const { error, dispatch } = useContext(AuthContext);

    const handleGoogleSignUp = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            // Handle successful sign-in here
            // console.log('Successful sign-in:', result.user.displayName, result.user.email, result.user.uid);

            // creating a unique username 
            const formattedName = result.user.displayName.trim().toLowerCase();
            const username = formattedName.replace(/\s+/g, '_');
            const uniqueUsername = `${username}_${Math.floor(Math.random() * 38454)}`;

            // console.log(uniqueUsername);


            if (result.user) {
                console.log(result)
                dispatch({ type: 'LOGIN_START' });
                try {
                    const res = await axios.post(`${baseURL}/auth/register`, {
                        username: uniqueUsername,
                        email: result.user.email,
                        password: result.user.uid,
                        profilePicture: result.user.photoURL,
                        name: result.user.displayName
                    });

                    if (res.data !== undefined && res.data?.success) {
                        localStorage.setItem('access_token', res.data?.access_token);
                        try {
                            const userInfo = await axios.get(`${baseURL}/user/userInfo/${res.data?.access_token}/${res.data?.userId}`);
                            dispatch({ type: 'LOGIN_SUCCESS', payload: userInfo?.data });
                            navigate('/');
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    navigate('/');
                } catch (error) {
                    dispatch({ type: 'LOGIN_FAILURE', payload: error.response.data });
                    console.log(error);
                }
            }
        } catch (error) {
            // Handle error here
            console.log('Error signing in with Google:', error.code, error.message);
        }
    }


    const handleSignup = async () => {
        dispatch({ type: 'LOGIN_START' });
        try {

            const res = await axios.post(`${baseURL}/auth/register`, signupData);

            if (res.data !== undefined && res.data?.success) {
                localStorage.setItem('access_token', res.data?.access_token);
                try {
                    const userInfo = await axios.get(`${baseURL}/user/userInfo/${res.data?.access_token}/${res.data?.userId}`);
                    dispatch({ type: 'LOGIN_SUCCESS', payload: userInfo?.data });
                    navigate('/');
                } catch (error) {
                    console.log(error);
                }
            }
            navigate('/');
        } catch (error) {
            dispatch({ type: 'LOGIN_FAILURE', payload: error.response.data });
            console.log(error);
        }
    };

    return (
        <div className='signup-container'>
            <div className='signup-box'>
                <p className='signup-title'>Create new account</p>
                <form className='signup-form' onSubmit={(e) => { e.preventDefault(); handleSignup()}}>
                    <label className='signup-label' htmlFor='username'>
                        Username
                    </label>
                    <input
                        className='signup-input'
                        name='username'
                        id='username'
                        type='text'
                        onChange={handleChange}
                        value={signupData.username}
                        required
                    />

                    <label className='signup-label' htmlFor='email'>
                        Email
                    </label>
                    <input
                        className='signup-input'
                        name='email'
                        id='email'
                        type='email'
                        onChange={handleChange}
                        value={signupData.email}
                        required
                    />

                    <label className='signup-label' htmlFor='password'>
                        Password
                    </label>
                    <input
                        className='signup-input'
                        name='password'
                        id='password'
                        type='password'
                        onChange={handleChange}
                        value={signupData.password}
                        required
                    />

                    {error && <span className='signup-error-message'>{error.message}</span>}

                <button
                    className='signup-btn'
                    
                    >
                    Sign up
                </button>
                    </form>
                <button
                    className='googleAuth-btn'
                    onClick={handleGoogleSignUp}
                >
                    <FcGoogle/>
                    Sign up with Google
                </button>

                <Link to='/login' className='auth-link'>Log in</Link>
            </div>
        </div>
    );
};

export default SignUp;
