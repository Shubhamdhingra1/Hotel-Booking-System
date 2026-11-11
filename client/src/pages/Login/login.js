import { useContext, useState } from 'react';
import './login.css';
import { AuthContext } from '../../Context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithCredentials } from '../../features/users/userApi';
import { completeAuthSession } from '../../shared/auth/session';
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from '../../components/GoogleAuth/googleAuth';
import { signInWithPopup } from "firebase/auth";

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const navigate = useNavigate();
    const { loading, error, dispatch } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await loginWithCredentials(credentials);
            if (res.data.success) {
                await completeAuthSession(dispatch, res.data.access_token, res.data.userId);
                navigate('/');
            }

        } catch (error) {
            dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
            console.log(error);
        }
    };

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                dispatch({ type: "LOGIN_START" });
                try {
                    const res = await loginWithCredentials({
                        email: result.user.email,
                        password: result.user.uid,
                    });
                    if (res.data.success) {
                        await completeAuthSession(dispatch, res.data.access_token, res.data.userId);
                        navigate('/');
                    }

                } catch (error) {
                    dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
                    console.log(error);
                }
            }
        } catch (error) {
            console.log('Error signing in with Google:', error.code, error.message);
        }
    };





    return (
        <div className='signup-container'>
            <div className='signup-box'>
                <p className='signup-title'>Login</p>
                <input onChange={handleChange} type='text' placeholder='username' className='signup-input' id='username' />
                <input onChange={handleChange} type='password' placeholder='password' className='signup-input' id='password' />
                {error && <span className='signup-error-message'>{error.message}</span>}
                <button disabled={loading} onClick={handleLogin} className='signup-btn'>Login</button>
                <button
                    className='googleAuth-btn'
                    onClick={handleGoogleLogin}
                >
                    <FcGoogle />
                    Sign in with Google
                </button>
                <Link to='/signUp' className='auth-link'>Create new account</Link>
            </div>
        </div>
    )
}

export default Login