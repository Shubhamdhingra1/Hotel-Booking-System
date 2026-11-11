import { httpClient } from '../../shared/api/httpClient';
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
      const [newUsersRes, totalUsersRes, bookingRes, totalHotelsRes, newHotelsRes] =
        await Promise.all([
          httpClient.get("/user/metrics/newusers"),
          httpClient.get("/user/metrics/totalusers"),
          httpClient.get("/room/metrics/bookings"),
          httpClient.get("/hotel/metrics/totalHotels"),
          httpClient.get("/hotel/metrics/newHotels"),
        ]);

      setNewUsers(newUsersRes.data.count);
      setTotalUsers(totalUsersRes.data.count);
      setBookingCount(bookingRes.data.count);
      setTotalHotels(totalHotelsRes.data.count);
      setNewHotels(newHotelsRes.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const [openCreateHotel, setOpenCreateHotel] = useState(false);
  const handleOpen = () => {
    setOpenCreateHotel(!openCreateHotel);
  };

  return (
    <div>
      <Navbar />
      <Header />
      <div className="container">
        <Link to='/create-hotel' className='btn-container'>
          <button className="create-hotel-btn" onClick={() => handleOpen()}>Create new Hotel</button>
        </Link>
        <Link to='/car-listings' className='btn-container'>
          <button type="button" className="create-hotel-btn">Review car listings</button>
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
