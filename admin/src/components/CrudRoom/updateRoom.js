import { useEffect, useState } from "react";
import { baseURL } from "../../baseURL/baseURL";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const UpdateRoom = ({ hotelId, roomId, i }) => {
    const { data, loading, reFetch } = useFetch(
        `${baseURL}/room/rooms/${hotelId}/${roomId}`
    );

    const [title, setTitle] = useState("");
    const [maxPeople, setMaxPeople] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setMaxPeople(data.maxPeople);
    }, [data]);

    const handleChange = (e, stateSetter) => {
        stateSetter(e.target.value);
    };

    const [action, setAction] = useState("");
    const [alert, setAlert] = useState(false);
    const handleAction = async () => {
        setAction(action);
        const access_token = localStorage.getItem("access_token");
        try {
            if (action === "update") {
                await axios.patch(`${baseURL}/room/token/${access_token}/${roomId}`, {
                    title,
                    description,
                    price,
                    maxPeople,
                });
                reFetch();
                console.log("Room updated successfully");
            } else if (action === "delete") {
                await axios.delete(
                    `${baseURL}/room/token/${access_token}/${hotelId}/${roomId}`
                );
                reFetch();
                console.log("Room deleted successfully");
            }
            // reFetch();
            setAlert(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleOpenAlert = (action) => {
        setAction(action);
        setAlert(true);
    };
    const handleCancel = () => {
        setAlert(false);
        reFetch();
    };

    return (
        <div className="crud-hotel">
            {loading ? <h1>Loading...</h1> : (
                <div className="crud-hotel__form">
                    <p className="crud-hotel__title">Room {i + 1}</p>

                    <label className="crud-hotel__label">Title : </label>
                    <input
                        className="crud-hotel__input" type="text"
                        value={title}
                        onChange={(e) => handleChange(e, setTitle)}
                    />
                    <label className="crud-hotel__label">Max People : </label>
                    <input
                        className="crud-hotel__input"
                        type="number"
                        value={maxPeople}
                        onChange={(e) => handleChange(e, setMaxPeople)}
                    />
                    <label className="crud-hotel__label">Description : </label>
                    <textarea
                        className="crud-hotel__textarea"
                        type="text"
                        value={description}
                        onChange={(e) => handleChange(e, setDescription)}
                    />
                    <label className="crud-hotel__label">Price : </label>
                    <input
                        className="crud-hotel__input"
                        type="number"
                        value={price}
                        onChange={(e) => handleChange(e, setPrice)}
                    />
                    <div className="updateButtonWrapper">
                        <p className="updateText">Update Now : </p>
                        <button
                            onClick={() => handleOpenAlert("update")}
                            className="updateButton"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => handleOpenAlert("delete")}
                            className="deleteButton"
                        >
                            Delete
                        </button>
                    </div>
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
            )}
        </div>
    );
};

export default UpdateRoom;
