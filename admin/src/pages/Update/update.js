import { useNavigate, useParams } from 'react-router-dom';
import { baseURL } from '../../baseURL/baseURL';
import Navbar from '../../components/Navbar/navbar';
import useFetch from '../../hooks/useFetch';
import './update.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateRoom from '../../components/CrudRoom/updateRoom';
import CreateRoom from '../../components/CrudRoom/createRoom';

const Update = () => {
    const { hotelId } = useParams();
    const { data, loading, reFetch } = useFetch(`${baseURL}/hotel/id/${hotelId}`);
    // console.log(data);

    const [hotelData, setHotelData] = useState({
        name: '',
        type: '',
        city: '',
        title: '',
        distance: '',
        address: '',
        description: '',
        rating: 0,
        cheapestPrice: '',
        featured: false
    });

    useEffect(() => {
        if (data) {
            setHotelData(data);
        }
    }, [data]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setHotelData((prevData) => ({
            ...prevData,
            [name]: inputValue
        }));
    };

    const [alert, setAlert] = useState(false);
    const [action, setAction] = useState("");

    const handleOpenAlert = (action) => {
        setAction(action);
        setAlert(true);
    };

    const navigate = useNavigate();
    const handleAction = async () => {
        setAction(action);
        const access_token = localStorage.getItem("access_token");
        try {
            if (action === "update") {
                await axios.patch(`${baseURL}/hotel/${access_token}/id/${hotelId}`, hotelData);
                console.log("Hotel updated successfully");
                reFetch();
                setAlert(false);
            } else if (action === "delete") {
                await axios.delete(`${baseURL}/hotel/${access_token}/id/${hotelId}`);
                console.log("Hotel deleted");
                setAlert(false);
                navigate('/hotels');
            }
            setAlert(false);
        } catch (error) {
            console.log(error);
        }
    };
    
    const handleCancel = () => {
        setAlert(false);
    }
    return (
        <div className='crud-hotel-wrapper'>
            <Navbar />
            {loading ? <h1>Loading...</h1> :
                <>
                    <div className='crud-hotel'>
                        <p className='crud-hotel__title'>Update Hotel</p>
                        <div className="crud-hotel__form" >
                            <label className="crud-hotel__label" htmlFor="name">Name:</label>
                            <input className="crud-hotel__input" type="text" id="name" name="name" value={hotelData.name} onChange={handleInputChange} required />

                            <label className="crud-hotel__label" htmlFor="type">Type:</label>
                            <input className="crud-hotel__input" type="text" id="type" name="type" value={hotelData.type} onChange={handleInputChange} required />

                            <label className="crud-hotel__label" htmlFor="city">City:</label>
                            <input className="crud-hotel__input" type="text" id="city" name="city" value={hotelData.city} onChange={handleInputChange} required />

                            <label className="crud-hotel__label" htmlFor="address">Address:</label>
                            <input className="crud-hotel__input" type="text" id="address" name="address" value={hotelData.address} onChange={handleInputChange} required />

                            <label className="crud-hotel__label" htmlFor="distance">Distance:</label>
                            <input className="crud-hotel__input" type="text" id="distance" name="distance" value={hotelData.distance} onChange={handleInputChange} required />



                            <label className="crud-hotel__label" htmlFor="title">Title:</label>
                            <input className="crud-hotel__input" type="text" id="title" name="title" value={hotelData.title} onChange={handleInputChange} required />

                            <label className="crud-hotel__label" htmlFor="description">Description:</label>
                            <textarea className="crud-hotel__textarea" id="description" name="description" value={hotelData.description} onChange={handleInputChange} required />

                            {/* <label className="crud-hotel__label" htmlFor="rooms">Rooms:</label>
                    <input className="crud-hotel__input" type="text" id="rooms" name="rooms" value={hotelData.rooms} onChange={handleInputChange} /> */}

                            <label className="crud-hotel__label" htmlFor="cheapestPrice">Cheapest Price:</label>
                            <input className="crud-hotel__input" type="number" id="cheapestPrice" name="cheapestPrice" value={hotelData.cheapestPrice} onChange={handleInputChange} required />
                            <div className='bottomField'>
                                <div className='crud-hotel-bottomField'>
                                    <label className="crud-hotel__label" htmlFor="rating">Rating:</label>
                                    <input type="number" id="rating" name="rating" min="0" max="5" value={hotelData.rating} onChange={handleInputChange} />
                                </div>
                                <div className='crud-hotel-bottomField'>
                                    <label className="crud-hotel__label" htmlFor="featured">Featured:</label>
                                    <input className="crud-hotel__checkbox" type="checkbox" id="featured" name="featured" checked={hotelData.featured} onChange={(e) => setHotelData((prevData) => ({ ...prevData, featured: e.target.checked }))} />
                                </div>
                            </div>
                            <div className='updateButtonWrapper'>
                                <button onClick={() => handleOpenAlert("update")} className='updateButton'>Update</button>
                                <button onClick={() => handleOpenAlert("delete")} className='deleteButton'>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>


                    <CreateRoom hotelId={hotelId} />

                    {
                        data.rooms.map((roomId, i) => (
                            <UpdateRoom hotelId={hotelId} roomId={roomId} key={i} i={i} />
                        ))
                    }
                </>
                // <div className='updateContainerWrapper'>

            }
            {alert && (
                <div className="deleteBox">
                    <div className="deleteBoxWrapper">
                        <p className="alert">Do you want to {action}?</p>
                        <p className="smallAlert">This can't be undone.</p>
                        <div className='buttonContainerWrapper'>
                            <div className="buttonContainer">
                                {action === "delete" && (
                                    <button
                                        onClick={() => handleAction()}
                                        className="deleteButton"
                                    >
                                        Delete
                                    </button>
                                )}
                                {action === "update" && (
                                    <button
                                        onClick={() => handleAction()}
                                        className="updateButton"
                                    >
                                        Update
                                    </button>
                                )}
                                <button onClick={handleCancel} className="cancelButton">
                                    No
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default Update