import { useContext, useEffect, useState } from 'react';
import './login.css';
import { AuthContext } from '../../Context/authContext';
import { httpClient } from '../../shared/api/httpClient';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from '../../components/GoogleAuth/googleAuth';
import { signInWithPopup } from "firebase/auth";
import { completeAuthSession } from '../../shared/auth/session';
import { requireAdminProfile } from '../../shared/auth/requireAdmin';

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const navigate = useNavigate();
    const { user, loading, error, dispatch } = useContext(AuthContext);

    useEffect(() => {
        if (user?.isAdmin) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const finishLogin = async (accessToken, userId) => {
        const profile = await completeAuthSession(dispatch, accessToken, userId);
        if (!requireAdminProfile(dispatch, profile)) return;
        navigate('/', { replace: true });
    };

    const loginErrorPayload = (err) =>
        err.response?.data ?? { message: err.message || "Login failed. Is the API running on port 8080?" };

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await httpClient.post("/auth/login", credentials);
            if (res.data.success) {
                await finishLogin(res.data.access_token, res.data.userId);
            } else {
                dispatch({
                    type: "LOGIN_FAILURE",
                    payload: { message: res.data.message || "Login failed" },
                });
            }
        } catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: loginErrorPayload(err) });
        }
    };

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                dispatch({ type: "LOGIN_START" });
                try {
                    const res = await httpClient.post("/auth/login", {
                        email: result.user.email,
                        password: result.user.uid,
                    });
                    if (res.data.success) {
                        await finishLogin(res.data.access_token, res.data.userId);
                    }
                } catch (err) {
                    dispatch({ type: "LOGIN_FAILURE", payload: loginErrorPayload(err) });
                }
            }
        } catch (err) {
            console.log('Error signing in with Google:', err.code, err.message);
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
            </div>
        </div>
    )
}

export default Login
