import './reserve.css';
import { AiOutlineCloseCircle } from "react-icons/ai";
import useFetch from '../../hooks/useFetch';
import { baseURL } from '../../baseURL/baseURL';
import { useContext, useEffect, useMemo, useState } from 'react';
import { SearchContext } from '../../Context/searchContext';
import { normalizeSearchOptions } from '../../utils/searchOptions';
import { AuthContext } from '../../Context/authContext';
import PaymentModal, { PaymentSuccessModal } from './PaymentModal';
import { blockRoomAvailability } from '../../features/hotels/hotelApi';
import { useBookingCheckout } from '../../shared/hooks/useBookingCheckout';
import {
    getStayNightTimestamps,
    isRoomNumberAvailable,
} from '../../utils/roomAvailability';

const Reserve = ({ setOpen, hotelId }) => {

    const { data, reFetch } = useFetch(`${baseURL}/hotel/rooms/${hotelId}`);
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
    const { dates, options } = useContext(SearchContext);
    const partySize = normalizeSearchOptions(options).people;
    const [requestedDates, setRequestedDates] = useState(dates);
    useEffect(() => {
        setRequestedDates(dates);
    }, [dates])


    const stayNights = useMemo(
        () =>
            getStayNightTimestamps(
                requestedDates[0]?.startDate,
                requestedDates[0]?.endDate
            ),
        [requestedDates]
    );

    const isAvailable = (roomNumber) => isRoomNumberAvailable(roomNumber, stayNights);

    const { user } = useContext(AuthContext);

    const nights = useMemo(() => {
        if (!stayNights?.length) return 1;
        return stayNights.length;
    }, [stayNights]);

    const priceByRoomNumberId = useMemo(() => {
        const map = {};
        if (!data) return map;
        data.forEach((room) => {
            room?.roomNumbers?.forEach((rn) => {
                map[rn._id] = room.price;
            });
        });
        return map;
    }, [data]);

    const maxPeopleByRoomNumberId = useMemo(() => {
        const map = {};
        if (!data) return map;
        data.forEach((room) => {
            room?.roomNumbers?.forEach((rn) => {
                map[rn._id] = room.maxPeople;
            });
        });
        return map;
    }, [data]);

    const selectedGuestCapacity = useMemo(() => {
        return selectedRooms.reduce(
            (sum, id) => sum + (Number(maxPeopleByRoomNumberId[id]) || 0),
            0
        );
    }, [selectedRooms, maxPeopleByRoomNumberId]);

    const totalAmount = useMemo(() => {
        return selectedRooms.reduce((sum, roomNumberId) => {
            const price = priceByRoomNumberId[roomNumberId] || 0;
            return sum + price * nights;
        }, 0);
    }, [selectedRooms, priceByRoomNumberId, nights]);

    const confirmBooking = async () => {
        const payloadDates = stayNights.map((t) => new Date(t).toISOString());
        await Promise.all(
            selectedRooms.map((roomId) => blockRoomAvailability(roomId, payloadDates))
        );
        await reFetch();
    };

    const {
        showPayment,
        setShowPayment,
        showSuccess,
        isProcessing,
        openCheckout,
        handlePayNow,
        handleSuccessDone: runCheckoutDone,
    } = useBookingCheckout({
        onConfirm: confirmBooking,
        onComplete: () => setOpen(false),
    });

    const handleOpenPayment = () => {
        if (selectedRooms.length === 0) {
            window.alert('Please select at least one room number.');
            return;
        }
        if (selectedGuestCapacity < partySize) {
            window.alert(
                `Your party is ${partySize} people but selected rooms fit only ${selectedGuestCapacity}. Add more rooms or change your search.`
            );
            return;
        }
        openCheckout();
    };

    const handleSuccessDone = async () => {
        try {
            await runCheckoutDone();
        } catch (error) {
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                'Booking failed';
            console.error(error);
            window.alert(`Payment succeeded but booking failed: ${msg}`);
        }
    };
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
                <button type="button" onClick={handleOpenPayment} className="roomButton">
                    Reserve Now!
                </button>
            </div>
            {showPayment && (
                <PaymentModal
                    nights={nights}
                    selectedCount={selectedRooms.length}
                    totalAmount={totalAmount}
                    isProcessing={isProcessing}
                    onClose={() => setShowPayment(false)}
                    onPaySuccess={handlePayNow}
                />
            )}
            {showSuccess && (
                <PaymentSuccessModal amount={totalAmount} onDone={handleSuccessDone} />
            )}
        </div>
    )
}

export default Reserve

