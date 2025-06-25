import "./header.css";
import { FaBed, FaPlane, FaCar, FaTaxi, FaCalendarAlt } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main css file for calendar range
import "react-date-range/dist/theme/default.css"; // theme css file for calendar range
import { useContext, useState } from "react";
import { DateRange } from "react-date-range";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../Context/searchContext";
import useFetch from "../../hooks/useFetch";
import { baseURL } from "../../baseURL/baseURL";

const Header = ({ type }) => {
  const { data } = useFetch(`${baseURL}/hotel/allCities`)
  const hotelCities = data;
  const [openSearchSuggestions, setOpenSearchSuggestions] = useState(false);
  const [filteredSuggestions, setfilteredSuggestions] = useState([])

  const handleChange = (e) => {
    setDestination(e.target.value);
    setfilteredSuggestions(hotelCities.filter((city) => {
      return city.toLowerCase().includes(e.target.value.toLowerCase());
    }));

    setOpenSearchSuggestions(true);
    setShowCalendar(false);
    setShowOptions(false);
    if (e.target.value === "") {
      setfilteredSuggestions([]);
      setOpenSearchSuggestions(false);
    }
  };
  const handleSelectSuggestion = (suggestion) => {
    setDestination(suggestion);
    setOpenSearchSuggestions(false);
    const inputField = document.getElementById("searchInput");
    if (inputField) {
      inputField.value = suggestion;
    }
  };

  const [showCalendar, setShowCalendar] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState({
    adults: 1,
    children: 0,
    rooms: 1,
  });

  const handleOptions = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]:
          operation === "increase" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const navigate = useNavigate();
  const [destination, setDestination] = useState("");

  const { dispatch } = useContext(SearchContext);
  
  
  const handleSearch = () => {
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
    // console.log("Dispatched from Header's handleSearch");
    navigate("/hotels", { state: { destination, dates, options } });
  };

  return (
    <div className="header">
      <div className="headerContainer">
        <div className="headerList">
          <div className="headerListItems active">
            <FaBed />
            <span>Stays</span>
          </div>
          <div className="headerListItems">
            <FaPlane />
            <span>Flights</span>
          </div>
          <div className="headerListItems">
            <FaCar />
            <span>Car rentals</span>
          </div>
          <div className="headerListItems">
            <FaBed />
            <span>Attractions</span>
          </div>
          <div className="headerListItems">
            <FaTaxi />
            <span>Airport taxis</span>
          </div>
        </div>
        {type !== "list" && (
          <>
            <h1 className="headerTitle">
              A lifetime of discounts? It's Genius
            </h1>
            <p className="headerDesc">
              Get rewarded for your travels - unlock instant savings of 10% or
              more with a free HotelBook account
            </p>
            {localStorage.getItem("user") === null && (
              <button className="headerSignButton">Sign in / Register</button>
            )}

            <div className="headerSearch">
              <div className="headerSearchItems">
                <FaBed className="headerSearchIcon" />
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Where are you going?"
                  className="headerSearchInput"
                  onChange={handleChange}
                />
                {openSearchSuggestions && (
                  <ul className="searchSuggestionList">
                    {filteredSuggestions.slice(0,10).map((suggestion) => (
                      <li
                        key={suggestion}
                        onClick={() => handleSelectSuggestion(suggestion)}
                        className="searchSuggestion"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="headerSearchItems calendar">
                <FaCalendarAlt
                  onClick={() => {
                    setShowCalendar(!showCalendar);
                    setShowOptions(false);
                  }}
                  className="headerSearchIcon"
                />
                <span
                  onClick={() => {
                    setShowCalendar(!showCalendar);
                    setShowOptions(false);
                  }}
                  className="headerSearchInput"
                >
                  {`${format(dates[0].startDate, "dd/MM/yyyy")}
                to 
                ${format(dates[0].endDate, "dd/MM/yyyy")}`}
                </span>

                {showCalendar && (
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setDates([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dates}
                    minDate={new Date()}
                    className="date"
                  />
                )}
              </div>
              <div className="headerSearchItems option">
                <BsFillPersonFill
                  onClick={() => {
                    setShowOptions(!showOptions);
                    setShowCalendar(false);
                  }}
                  className="headerSearchIcon"
                />
                <span
                  onClick={() => {
                    setShowOptions(!showOptions);
                    setShowCalendar(false);
                  }}
                  className="headerSearchInput"
                >{`${options.adults} adults, ${options.children} children, ${options.rooms} room`}</span>

                {showOptions && (
                  <div className="options">
                    <div className="optionItem">
                      <span className="optionText">Adults:</span>
                      <div className="optionsButtonContainer">
                        <button
                          disabled={options.adults <= 1}
                          className="optionCounterButton"
                          onClick={() => handleOptions("adults", "decrease")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.adults}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOptions("adults", "increase")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Children:</span>
                      <div className="optionsButtonContainer">
                        <button
                          disabled={options.children <= 0}
                          className="optionCounterButton"
                          onClick={() => handleOptions("children", "decrease")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.children}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOptions("children", "increase")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Rooms:</span>
                      <div className="optionsButtonContainer">
                        <button
                          disabled={options.rooms <= 1}
                          className="optionCounterButton"
                          onClick={() => handleOptions("rooms", "decrease")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.rooms}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOptions("rooms", "increase")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="headerSearchItems">
                <button className="headerSearchButton" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
