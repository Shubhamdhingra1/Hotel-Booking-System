import React, { useState } from "react";
import axios from "axios";
import './createRoom.css';
import { baseURL } from "../../baseURL/baseURL";

const CreateRoom = ({ hotelId }) => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState('');
    const [maxPeople, setMaxPeople] = useState('');
    const [description, setDescription] = useState("");
    const [roomNumbers, setRoomNumbers] = useState([{ number: '', unavailableDates: [] }]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newRoom = {
            title,
            price,
            maxPeople,
            description,
            roomNumbers,
        };

        const access_token = localStorage.getItem('access_token');
        try {
            await axios.post(`${baseURL}/room/token/${access_token}/${hotelId}`, newRoom);
            console.log("Room created successfully!");
            // Reset form values
            setTitle("");
            setPrice('');
            setMaxPeople('');
            setDescription("");
            setRoomNumbers([{ number: '', unavailableDates: [] }]);
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };

    const handleRoomNumberChange = (index, field, value) => {
        const updatedRoomNumbers = [...roomNumbers];
        updatedRoomNumbers[index][field] = value;
        setRoomNumbers(updatedRoomNumbers);
    };

    const addRoomNumber = () => {
        setRoomNumbers([...roomNumbers, { number: '', unavailableDates: [] }]);
    };

    const removeRoomNumber = (index) => {
        const updatedRoomNumbers = [...roomNumbers];
        updatedRoomNumbers.splice(index, 1);
        setRoomNumbers(updatedRoomNumbers);
    };

    return (
        <div className="crud-hotel">
            <p className='crud-hotel__title'>Create Room</p>
            <form className="crud-hotel__form" onSubmit={handleSubmit}>
                <label className="crud-hotel__label" htmlFor="name">Title : </label>
                <input
                    className="crud-hotel__input"
                    type="text"
                    id="name"
                    name="name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <label className="crud-hotel__label" htmlFor="name">Price : </label>
                <input
                    className="crud-hotel__input"
                    type="number"
                    id="name"
                    name="name"
                    value={price}
                    min={0}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                />
                <label className="crud-hotel__label" htmlFor="name">Max People : </label>
                <input
                    className="crud-hotel__input"
                    type="number"
                    id="name"
                    name="name"
                    value={maxPeople}
                    min={1}
                    onChange={(e) => setMaxPeople(Number(e.target.value))}
                    required
                />
                <label className="crud-hotel__label" htmlFor="name">Description : </label>
                <textarea
                    className="crud-hotel__textarea"
                    type="text"
                    id="name"
                    name="name"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <div className="bottomContainerWrapper" >
                    <div className="bottomContainer">
                        <label>Room Numbers : </label>
                        <div className="addRoomsContainer">
                            {roomNumbers.map((room, index) => (
                                <div key={index} className="addRooms">
                                    <label>Number:</label>
                                    <input
                                        type="number"
                                        value={room.number}
                                        min={0}
                                        onChange={(e) => handleRoomNumberChange(index, "number", Number(e.target.value))}
                                        required
                                    />
                                    <button type="button" className="deleteButton" onClick={() => removeRoomNumber(index)}>
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type="button" className="updateButton" onClick={addRoomNumber}>
                        Add Room Numbers
                    </button>
                </div>
                <div className="createButtonContainer">
                    <p>Create this room : </p>
                    <button type="submit" className="createButton">Create</button>
                </div>
            </form>
        </div>
    );
};

export default CreateRoom;
