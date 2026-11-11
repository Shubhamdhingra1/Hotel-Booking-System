import React, { useState, useEffect, useContext } from 'react';
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  cloudinaryUploadUrl,
} from '../../shared/upload/cloudinaryConfig';
import axios from 'axios';
import './user.css';
import { AuthContext } from '../../Context/authContext';
import { useNavigate, useParams } from 'react-router-dom';
import { baseURL } from '../../baseURL/baseURL';
import useFetch from '../../hooks/useFetch';
import { clearAccessToken } from '../../shared/auth/tokenStorage';
import { updateUserProfile } from '../../features/users/userApi';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({});
  const { id } = useParams();

  const { dispatch } = useContext(AuthContext);
  const { data } = useFetch(`${baseURL}/user/profile/${id}`);
  useEffect(() => {
    setUserInfo(data);
  }, [data])

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
      const response = await updateUserProfile(id, userInfo);
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
    <div className='user-profile-page'>
      <div className="user-profile-wrapper">
        <div className='user-profile'>
          <div className="profile-picture">
            {userInfo.profilePicture ? (
              <label className='profilePicture-label' htmlFor='profilePicture'>
                <img src={userInfo.profilePicture} alt="Profile" />
              </label>

            ) : (
              <div className="default-profile-picture">
                <label className='profilePicture-label' htmlFor='profilePicture'>Add Profile Picture</label>
              </div>
            )}
          </div>

          <input className='profilePicture-input' name='profilePicture' id='profilePicture' type="file" onChange={handleProfilePictureChange} />

          <div className="profile-info-wrapper">
            <h2>{userInfo?.name}</h2>
            <form className='profile-info'>
              <label className='profile-info-label' htmlFor='name'>Name</label>
              <input className='profile-info-input' value={userInfo?.name} onChange={handleChange} placeholder='Enter name' name='name' id='name' required />

              <label className='profile-info-label' htmlFor='username'>Username</label>
              <input className='profile-info-input' value={userInfo?.username} onChange={handleChange} placeholder='Enter username' name='username' id='username' required />


              <label className='profile-info-label' htmlFor='email'>Email</label>
              <input className='profile-info-input' value={userInfo?.email} placeholder='Enter email' name='email' id='email' readOnly />


              <label className='profile-info-label' htmlFor='phone'>Phone</label>
              <input className='profile-info-input' value={userInfo?.phone} onChange={handleChange} placeholder='Enter phone number' name='phone' id='phone' type='number' />
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
              className="profile-info-update-btn"
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

export default UserProfile;
