import React, { useState, useEffect } from 'react';
import './userProfile.css'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { baseURL } from '../../baseURL/baseURL';
import useFetch from '../../hooks/useFetch';
import Navbar from '../../components/Navbar/navbar';

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState({});
    const { id } = useParams();

    const { data } = useFetch(`${baseURL}/user/userInfo/${localStorage.getItem("access_token")}/${id}`)
    useEffect(() => {
        setUserInfo(data);
    }, [data])

    const navigate = useNavigate();
    const handleProfileDelete = async () => {
        try {
            await axios.delete(`${baseURL}/user/${localStorage.getItem("access_token")}/${id}`,
                userInfo
            );
            console.log("Deleted successfully");
            navigate('/');
        } catch (error) {
            console.error('Error deleting user profile:', error);
        }
    };

    return (
        <div className='user-profile-page'>
            <Navbar/>
            <div className="user-profile-wrapper">
                <div className='user-profile'>
                    <div className="user-profile-picture">
                        {userInfo.profilePicture ? (
                            <label className='user-profilePicture-label' htmlFor='profilePicture'>
                                <img src={userInfo.profilePicture} alt="Profile" />
                            </label>

                        ) : (
                            <div className="default-user-profile-picture">
                                <label className='user-profilePicture-label'>No picture</label>
                            </div>
                        )}
                    </div>

                    <div className="user-profile-info-wrapper">
                        <h2>{userInfo?.name}</h2>
                        <form className='user-profile-info'>
                            <label className='user-profile-info-label'>Name</label>
                            <input className='user-profile-info-input' value={userInfo?.name} readOnly/>

                            <label className='user-profile-info-label'>Username</label>
                            <input className='user-profile-info-input' value={userInfo?.username} readOnly />

                            <label className='user-profile-info-label'>Email</label>
                            <input className='user-profile-info-input' value={userInfo?.email} readOnly />


                            <label className='user-profile-info-label'>Phone</label>
                            <input className='user-profile-info-input' value={userInfo?.phone}readOnly/>
                        </form>

                        <button className='delete-btn' onClick={handleProfileDelete}>Delete Profile</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
