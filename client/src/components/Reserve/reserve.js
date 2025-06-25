import './reserve.css';
import { AiOutlineCloseCircle } from "react-icons/ai";
import useFetch from '../../hooks/useFetch';
import { baseURL } from '../../baseURL/baseURL';
import { useContext, useEffect, useState } from 'react';
import { SearchContext } from '../../Context/searchContext';
import axios from 'axios';
import { AuthContext } from '../../Context/authContext';

const Reserve = ({ setOpen, hotelId }) => {

    const { data } = useFetch(`${baseURL}/hotel/rooms/${hotelId}`);
    // console.log(data);

    const [selectedRooms, setSelectedRooms] = useState([]);

    // console.log(selectedRooms);
    const handleSelect = (e) => {
        const selected = e.target.checked;
        const value = e.target.value;
        setSelectedRooms(selected ? [...selectedRooms, value] :
            selectedRooms.filter((room) => room !== value)
        );
    }
    const { dates } = useContext(SearchContext);
    const [requestedDates, setRequestedDates] = useState(dates);
    useEffect(() => {
        setRequestedDates(dates);
    }, [dates])


    const getDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const date = new Date(start?.getTime());
        let list = [];

        while (date <= end) {
            list.push(new Date(date).getTime());
            date.setDate(date?.getDate() + 1);
        }
        return list;
    }
    const allDates = getDatesInRange(requestedDates[0]?.startDate, requestedDates[0]?.endDate);
    
    const isAvailable = (roomNumber) => {

        const isFound = roomNumber?.unavailableDates?.some((date) =>
            allDates.includes(new Date(date)?.getTime())
        ) || false;
        // The .some() method iterates over the unavailableDates array and checks if any of the dates satisfy the condition inside the callback function
        // The callback function converts each date in unavailableDates array to a timestamp using new Date(date).getTime()
        // It then checks if this timestamp is present in the allDates array using the .includes() method
        // If any of the dates match, the isFound variable is set to true

        return !isFound;
        // The function returns the negation of the isFound variable
        // If isFound is true, indicating that at least one unavailable date was found, the function returns false
        // Otherwise, if isFound is false, indicating that none of the dates in unavailableDates match the dates in alldates, the function returns true
    };

    const { user } = useContext(AuthContext);
    const handleClick = async () => {
        try {
            await Promise.all(selectedRooms.map((roomId) => {
                const res = axios.patch(`${baseURL}/room/availability/token/${localStorage.getItem("access_token")}/${user._id}/${roomId}`, {
                    "dates": allDates
                });
                return res.data;
            }));
            setOpen(false);
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div className='reserve'>
            <div className='reserveContainer'>
                <AiOutlineCloseCircle
                    className='roomCloseCircle'
                    onClick={() => setOpen(false)}
                />
                <span className='reserveTitle'>Select Your rooms:</span>
                <div className='rooms'>
                    {data.map((room) => {
                        return (
                            <div className='roomItems' key={room?._id}>
                                <div className='roomItemInfo'>
                                    <div className='roomTitle'>{room?.title}</div>
                                    <div className='roomDescription'>{room?.description}</div>
                                    <div ><span className='roomItemHeadings'>Price : </span>{room?.price}</div>
                                    <div ><span className='roomItemHeadings'>Max. People : </span>{room?.maxPeople}</div>
                                </div>
                                <div className='selectRooms'>
                                    {room?.roomNumbers.map((roomNumber) => (
                                        <div className='room' key={roomNumber._id}>
                                            <label className='roomNumberLabel'>{roomNumber?.number}</label>
                                            <input
                                                type="checkbox"
                                                value={roomNumber?._id}
                                                onChange={handleSelect}
                                                disabled={!isAvailable(roomNumber)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>)
                    })}
                </div>
                <button onClick={handleClick} className="roomButton">
                    Reserve Now!
                </button>
            </div>
        </div>
    )
}

export default Reserve

