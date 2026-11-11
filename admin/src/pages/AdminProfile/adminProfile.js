import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_UPLOAD_PRESET,
    cloudinaryUploadUrl,
} from '../../shared/upload/cloudinaryConfig';
import './adminProfile.css';
import { AuthContext } from '../../Context/authContext';
import { useNavigate, useParams } from 'react-router-dom';
import { baseURL } from '../../baseURL/baseURL';
import useFetch from '../../hooks/useFetch';
import { httpClient } from '../../shared/api/httpClient';
import { clearAccessToken } from '../../shared/auth/tokenStorage';
import Navbar from '../../components/Navbar/navbar';

const AdminProfile = () => {
    const [userInfo, setUserInfo] = useState({});
    const { id } = useParams();

    const { dispatch } = useContext(AuthContext);
    const { data } = useFetch(`${baseURL}/user/profile/${id}`)
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
            data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            data.append("cloud_name", CLOUDINARY_CLOUD_NAME);
            const uploadRes = await axios.post(cloudinaryUploadUrl("image"), data);

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
        clearAccessToken();
        navigate("/login");
    };

    const [updateStatus, setUpdateStatus] = useState("idle");

    const handleProfileUpdate = async () => {
        setUpdateStatus("loading");
        try {
            const response = await httpClient.patch(`/user/profile/${id}`, userInfo);
            dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
            setUpdateStatus("success");
            setTimeout(() => setUpdateStatus("idle"), 3500);
        } catch (error) {
            console.error("Error updating user profile:", error);
            setUpdateStatus("error");
            setTimeout(() => setUpdateStatus("idle"), 4000);
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

                        {updateStatus === "success" && (
                            <p className="profile-update-status profile-update-status--success" role="status">
                                Profile updated successfully
                            </p>
                        )}
                        {updateStatus === "error" && (
                            <p className="profile-update-status profile-update-status--error" role="alert">
                                Could not update profile. Please try again.
                            </p>
                        )}
                        <button
                            type="button"
                            className="admin-profile-info-update-btn"
                            onClick={handleProfileUpdate}
                            disabled={updateStatus === "loading"}
                        >
                            {updateStatus === "loading" ? "Updating profile…" : "Update Profile"}
                        </button>
                        <button type="button" className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
