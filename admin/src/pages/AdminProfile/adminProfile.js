import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './adminProfile.css';
import { AuthContext } from '../../Context/authContext';
import { useNavigate, useParams } from 'react-router-dom';
import { baseURL } from '../../baseURL/baseURL';
import useFetch from '../../hooks/useFetch';
import Navbar from '../../components/Navbar/navbar';

const AdminProfile = () => {
    const [userInfo, setUserInfo] = useState({});
    const { id } = useParams();

    const { dispatch } = useContext(AuthContext);
    const { data } = useFetch(`${baseURL}/user/userInfo/${localStorage.getItem("access_token")}/${id}`)
    useEffect(() => {
        setUserInfo(data);
    }, [data])

    // useEffect(() => {
    //   console.log(userInfo)
    // }, [userInfo])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        // console.log(file);
        try {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "HotelBook.com");
            data.append("cloud_name", "dox9ptswj");
            const uploadRes = await axios.post(
                "https://api.cloudinary.com/v1_1/dox9ptswj/image/upload",
                data
            );

            const { url } = await uploadRes.data;
            console.log(url);
            setUserInfo((prevData) => ({
                ...prevData,
                [e.target.name]: url,
            }))
        } catch (error) {
            console.log(error);
        }
    };

    // useEffect(() => {
    //   console.log(userInfo);
    // }, [userInfo])

    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        localStorage.setItem("access_token", null);
        navigate("/login");
    };

    const handleProfileUpdate = async () => {
        dispatch({ type: "LOGIN_START" });
        try {
            const response = await axios.patch(`${baseURL}/user/${localStorage.getItem("access_token")}/${id}`,
                userInfo
            );
            console.log(response.data);
            dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
            console.log("Updated successfully");
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    return (
        <div className='admin-profile-page'>
            <Navbar/>
            <div className="admin-profile-wrapper">
                <div className='admin-profile'>
                    <div className="admin-profile-picture">
                        {userInfo.profilePicture ? (
                            <label className='admin-profilePicture-label' htmlFor='profilePicture'>
                                <img src={userInfo.profilePicture} alt="Profile" />
                            </label>

                        ) : (
                            <div className="default-admin-profile-picture">
                                <label className='admin-profilePicture-label' htmlFor='profilePicture'>+</label>
                            </div>
                        )}
                    </div>

                    <input className='admin-profilePicture-input' name='profilePicture' id='profilePicture' type="file" onChange={handleProfilePictureChange} />
                    <div className="admin-profile-info-wrapper">
                        <h2>{userInfo?.name}</h2>
                        <form className='admin-profile-info'>
                            <label className='admin-profile-info-label' htmlFor='name'>Name</label>
                            <input className='admin-profile-info-input' value={userInfo?.name} onChange={handleChange} name='name' id='name' required />

                            <label className='admin-profile-info-label' htmlFor='username'>Username</label>
                            <input className='admin-profile-info-input' value={userInfo?.username} onChange={handleChange} name='username' id='username' required />


                            <label className='admin-profile-info-label' htmlFor='phone'>Phone</label>
                            <input className='admin-profile-info-input' value={userInfo?.phone} onChange={handleChange} name='phone' id='phone' type='number' />
                        </form>

                        <button className='admin-profile-info-update-btn' onClick={handleProfileUpdate}>Update Profile</button>
                        <button className='logout-btn' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
