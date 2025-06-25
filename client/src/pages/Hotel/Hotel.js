import React, { useContext, useState } from 'react'
import './hotel.css';
import MailList from '../../components/MailList/maillist';
import Footer from '../../components/Footer/footer';
import Header from '../../components/Header/header';
import Navbar from '../../components/Navbar/navbar';
import { AiOutlineCloseCircle, AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { IoLocationSharp } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { SearchContext } from '../../Context/searchContext';
import { AuthContext } from '../../Context/authContext';
import Reserve from '../../components/Reserve/reserve';
import { baseURL } from '../../baseURL/baseURL';

const Hotel = () => {
  const location = useLocation();
  const id = location.pathname.split('/')[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { data,} = useFetch(`${baseURL}/hotel/id/${id}`);
  // console.log(data, "Loading = ", loading, "Error = ", error);


  const { dates, options } = useContext(SearchContext);
  // console.log(dates);
  const rooms = options.rooms || 1;

  const MILISECONDS_PER_DAY = 60 * 60 * 24 * 1000;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2?.getTime() - date1?.getTime());
    const dayDiff = Math.ceil(timeDiff / MILISECONDS_PER_DAY) + 1;
    if (dayDiff <= 0 || isNaN(dayDiff)) return 1;
    return dayDiff;
  }

  const nights = dayDifference(new Date(dates[0]?.endDate), new Date(dates[0]?.startDate));

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? data.photos.length-1 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === data.photos.length-1 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber)
  };
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleClick = () => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };
  return (
    <div className='hotelPage'>
      {open && (
        <div className="slider">
          <AiOutlineCloseCircle
            className="close"
            onClick={() => setOpen(false)}
          />
          <AiOutlineArrowLeft
            className="arrow"
            onClick={() => handleMove("l")}
          />
          <div className="sliderWrapper">
            <img src={data.photos[slideNumber]} alt="" className="sliderImg" />
          </div>
          <AiOutlineArrowRight
            className="arrow"
            onClick={() => handleMove("r")}
          />
        </div>
      )}
      <Navbar />
      <Header type="list" />
      <div className="hotelContainer">
        <div className="hotelWrapper">
          <button className="bookNow" onClick={handleClick}>Reserve or Book Now!</button>
          <h1 className="hotelTitle">{data.name}</h1>
          <div className="hotelAddress">
            <IoLocationSharp />
            <span>{data.address}</span>
          </div>
          <span className="hotelDistance">
            Excellent location – {data.distance}
          </span>
          <span className="hotelPriceHighlight">
            Book a stay over ₹{data.cheapestPrice} per night at this property and get a free airport taxi
          </span>
          <div className="hotelImages">
            {data.photos?.slice(0,6).map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo}
                  alt=""
                  className="hotelImg"
                />
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">{data.title}</h1>
              <p className="hotelDesc">{data.description}</p>
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for a {nights}-night stay!</h1>
              <span>
                Located in the real heart of Krakow, this property has an
                excellent location <b>rating of {data.rating}!</b>
              </span>
              <h2>
                <b>₹{data.cheapestPrice * nights * rooms}</b> ({nights} nights, {rooms} rooms)
              </h2>
              <button onClick={handleClick}>Reserve or Book Now!</button>
            </div>
          </div>
        </div>
        {openModal && <Reserve setOpen={setOpenModal} hotelId={id} />}
      </div>
      <MailList />
      <Footer />
    </div>
  );
}

export default Hotel