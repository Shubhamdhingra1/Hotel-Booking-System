import axios from 'axios';
import React, { useState } from 'react';
import './createHotel.css';
import Navbar from '../../components/Navbar/navbar';
import { baseURL } from '../../baseURL/baseURL';
import { useNavigate } from 'react-router-dom';



const CreateHotel = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        city: '',
        address: '',
        distance: '',
        photos: [],
        title: '',
        description: '',
        rating: 0,
        rooms: [],
        cheapestPrice: 0,
        featured: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const response = await axios.post('/api/hotels', formData);
    //     console.log(response);
    //     // Reset the form after submission
    //     setFormData({
    //         name: '',
    //         type: '',
    //         city: '',
    //         address: '',
    //         distance: '',
    //         title: '',
    //         description: '',
    //         rating: 0,
    //         // rooms: [],
    //         cheapestPrice: 0,
    //         featured: false,
    //     });
    // };

    const [files, setFiles] = useState([]);
    
    const handleFileChange = (e) => {
        const filesArray = Array.from(e.target.files); // Convert FileList to Array
        setFiles([...files, ...filesArray]);
    };
    
    const [creating, setCreating] = useState(false);
    const handleUpload = async (e) => {
        e.preventDefault();
        setCreating(true);
        console.log(files)
        try {
            const list = await Promise.all(
                Object.values(files).map(async (file) => {
                    const data = new FormData();
                    data.append("file", file);
                    data.append("upload_preset", "HotelBook.com");
                    data.append("cloud_name", "dox9ptswj");
                    const uploadRes = await axios.post(
                        "https://api.cloudinary.com/v1_1/dox9ptswj/image/upload",
                        data
                    );

                    const { url } = await uploadRes.data;
                    return await url;
                })
            );


            const newhotel = {
                ...formData,
                photos: list,
            };

            const response = await axios.post(`${baseURL}/hotel/${localStorage.getItem('access_token')}`, newhotel);
            navigate('/hotels')
            console.log('Hotel created');
            setCreating(false);
            const newHotelId = response.data._id;
            console.log(newHotelId)

            navigate(`/hotels/update/${newHotelId}`);

        } catch (err) { console.log(err) }
    };
    return (
        <div className='crud-hotel-wrapper'>
            <Navbar />
            <div className="crud-hotel">
                <p className="crud-hotel__title">Create a Hotel</p>
                <form className="crud-hotel__form" onSubmit={handleUpload}>
                    <label className="crud-hotel__label" htmlFor="name">Name:</label>
                    <input className="crud-hotel__input" type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

                    <label className="crud-hotel__label" htmlFor="type">Type:</label>
                    <input className="crud-hotel__input" type="text" id="type" name="type" value={formData.type} onChange={handleChange} required />

                    <label className="crud-hotel__label" htmlFor="city">City:</label>
                    <input className="crud-hotel__input" type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />

                    <label className="crud-hotel__label" htmlFor="address">Address:</label>
                    <input className="crud-hotel__input" type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />

                    <label className="crud-hotel__label" htmlFor="distance">Distance:</label>
                    <input className="crud-hotel__input" type="text" id="distance" name="distance" value={formData.distance} onChange={handleChange} required />

                    <label className="crud-hotel__label" htmlFor="photos">Upload Photos:</label>
                    <div className='uploadContainer'>
                        <div className="images">
                            {files?.map((file) => (
                                <img
                                    className='image'
                                    src={
                                        file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                    }
                                    alt=""
                                />))}
                            {files.length === 0 && <label htmlFor="photos"><img
                                className='image'
                                src={
                                    "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                }
                                alt=""
                            /></label>}
                        </div>
                        <input className="crud-hotel__input" type="file" multiple id="photos" name="photos" value={formData.photos} onChange={handleFileChange} />
                        {/* <button onClick={handleUpload} className='uploadButton'>Upload</button> */}
                    </div>

                    <label className="crud-hotel__label" htmlFor="title">Title:</label>
                    <input className="crud-hotel__input" type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />

                    <label className="crud-hotel__label" htmlFor="description">Description:</label>
                    <textarea className="crud-hotel__textarea" id="description" name="description" value={formData.description} onChange={handleChange} required />

                    {/* <label className="crud-hotel__label" htmlFor="rooms">Rooms:</label>
                    <input className="crud-hotel__input" type="text" id="rooms" name="rooms" value={formData.rooms} onChange={handleChange} /> */}

                    <label className="crud-hotel__label" htmlFor="cheapestPrice">Cheapest Price:</label>
                    <input className="crud-hotel__input" type="number" id="cheapestPrice" name="cheapestPrice" value={formData.cheapestPrice} onChange={handleChange} required />
                    <div className='bottomField'>
                        <div className='crud-hotel-bottomField'>
                            <label className="crud-hotel__label" htmlFor="rating">Rating:</label>
                            <input type="number" id="rating" name="rating" min="0" max="5" value={formData.rating} onChange={handleChange} />
                        </div>
                        <div className='crud-hotel-bottomField'>
                            <label className="crud-hotel__label" htmlFor="featured">Featured:</label>
                            <input className="crud-hotel__checkbox" type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={(e) => setFormData((prevData) => ({ ...prevData, featured: e.target.checked }))} />
                        </div>
                    </div>
                    <button className="crud-hotel__button" onClick={handleUpload} type="submit">
                        {creating ? 'Creating...' : "Create"}
                    </button>
                </form>
            </div>
        </div>

    );
};

export default CreateHotel;
