import "./hotels.css";
import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import Navbar from "../../components/Navbar/navbar";
import Header from "../../components/Header/header";
import SearchItems from "../../components/SearchItems/searchitems";
import useFetch from "../../hooks/useFetch";
import { baseURL } from "../../baseURL/baseURL";
import { SearchContext } from "../../Context/searchContext";
import { useLocation } from "react-router-dom";

const Hotels = () => {
  const location = useLocation();

  const [destination, setDestination] = useState(location.state.destination);
  const [type, setType] = useState(location.state.type);
  const [dates, setDates] = useState(location.state.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(99999);

  const handleOptions = (name, value) => {
    setOptions(prev => {
      return {
        ...prev, [name]: value ? options[name] = value : options[name],
      }
    })
  }

  const { data, loading, error, reFetch } = useFetch(`${baseURL}/hotel?city=${destination}&type=${type}&min=${min || 0}&max=${max || 99999}`);

  const { dispatch } = useContext(SearchContext);
  const handleClick = () => {
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
    // console.log("Dispatched from Hotel Search List's handleClick");
    reFetch();
  };

  useEffect(() => {
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
    // console.log("Dispatched from Hotel Search List's useEffect");
  }, [dates, destination, dispatch, options])


  return (
    <div className="searchHotelsPage">
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input value={destination} type="text" onChange={(e) => setDestination(e.target.value)} />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span className="dateInput" onClick={() => setOpenDate(!openDate)}>{`${format(
                dates[0].startDate,
                "dd/MM/yyyy"
              )} to ${format(dates[0].endDate, "dd/MM/yyyy")}`}
              </span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDates([item.selection])}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night (₹)</small>
                  </span>
                  <input type="number" className="lsOptionInput" onChange={(e) => setMin(e.target.value)} value={`${min}`} />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night (₹)</small>
                  </span>
                  <input type="number" className="lsOptionInput" onChange={(e) => setMax(e.target.value)} value={`${max}`} />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    value={options.adults}
                    onChange={(e) => handleOptions('adults', e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    value={options.children}
                    onChange={(e) => handleOptions('children', e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    value={options.rooms}
                    onChange={(e) => handleOptions('rooms', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button onClick={handleClick}>Search</button>
          </div>

          <div className="listResult">
            {
              !error && loading ? <h1>Loading...</h1> :
                <div>
                  {type && <h1 style={{margin:"0", marginBottom:"8px", padding:"0"}} className="lsTitle">Type : {type }</h1>}
                  {data.map(data => (<SearchItems data={data} key={data._id} />))}
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hotels