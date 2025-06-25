import axios from 'axios';
import { baseURL } from '../../baseURL/baseURL';
import Header from '../../components/Header/header';
import Navbar from '../../components/Navbar/navbar';
import './dashboard.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {

  const [newUsers, setNewUsers] = useState();
  const [totalUsers, setTotalUsers] = useState();
  const [newHotels, setNewHotels] = useState();
  const [totalHotels, setTotalHotels] = useState();
  const [bookingCount, setBookingCount] = useState();

  const getData = async () => {
    try {
      const newUsers = await axios.get(`${baseURL}/user/newusers/${localStorage.getItem('access_token')}`);
      const totalUsers = await axios.get(`${baseURL}/user/totalusers/${localStorage.getItem('access_token')}`);
      const bookingCount = await axios.get(`${baseURL}/room/bookings/token/${localStorage.getItem('access_token')}`);
      const totalHotels = await axios.get(`${baseURL}/hotel/${localStorage.getItem('access_token')}/totalHotels`);
      const newHotels = await axios.get(`${baseURL}/hotel/${localStorage.getItem('access_token')}/newHotels`);

      setNewUsers(await newUsers.data.count);
      setTotalUsers(await totalUsers.data.count);
      setNewHotels(await newHotels.data.count);
      setTotalHotels(await totalHotels.data.count);
      setBookingCount(await bookingCount.data.count);

      // console.log("newUsers = ", await newUsers.data.count);
      // console.log("totalUsers = ", await totalUsers.data.count);
      // console.log("bookingCount = ", await bookingCount.data.count);
      // console.log("newHotels = ", await newHotels.data.count);
      // console.log("totalHotels = ", await totalHotels.data.count);

    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getData();
  }, []);

  const [openCreateHotel, setOpenCreateHotel] = useState(false);
  const handleOpen = () => {
    setOpenCreateHotel(!openCreateHotel);
  }
  return (
    <div>
      <Navbar />
      <Header />
      <div className="container">
        <Link to='/create-hotel' className='btn-container'>
          <button className="create-hotel-btn" onClick={() => handleOpen()}>Create new Hotel</button>
        </Link>

        <div className="dashboard-container">
          <div className="dashboard-item">
            <p className="dashboard-value">{newUsers}</p>
            <p className="dashboard-heading">New Users</p>
          </div>
          <div className="dashboard-item">
            <p className="dashboard-value">{newHotels}</p>
            <p className="dashboard-heading">New Hotels</p>
          </div>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-item">
            <p className="dashboard-value">{bookingCount}</p>
            <p className="dashboard-heading">Bookings</p>
          </div>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-item">
            <p className="dashboard-value">{totalUsers}</p>
            <p className="dashboard-heading">Total Users</p>
          </div>
          <div className="dashboard-item">
            <p className="dashboard-value">{totalHotels}</p>
            <p className="dashboard-heading">Total Hotels</p>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Dashboard