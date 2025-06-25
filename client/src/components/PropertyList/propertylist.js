import { baseURL } from '../../baseURL/baseURL';
import useFetch from '../../hooks/useFetch';
import './propertylist.css'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { SearchContext } from '../../Context/searchContext';
// import {Link} from 'react-router-dom'

const Propertylist = () => {

  const photoData = [
    "https://c4.wallpaperflare.com/wallpaper/624/380/1000/life-resort-hotel-resort-hotel-wallpaper-preview.jpg",
    "https://s1.best-wallpaper.net/wallpaper/m/1706/City-Hotel-building_m.webp",
    "https://media.istockphoto.com/id/470455143/photo/cheap-motel-room-bed.jpg?s=612x612&w=0&k=20&c=kquWQfvZ4Y_ffwPn0ypJOoinvUPy4T09KODxZe4c0fA=",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTArY3ixjLtHjwT6S9DWvlbQD-ULO4D0Sgx8g&usqp=CAU",
    "https://c4.wallpaperflare.com/wallpaper/74/457/102/life-room-interior-home-wallpaper-preview.jpg",
  ];

  const { data, loading } = useFetch(`${baseURL}/hotel/countByType?limit=5`);

  const navigate = useNavigate();
  const { destination, dates, options, dispatch } = useContext(SearchContext);
  dispatch({ type: "RESET_SEARCH" });
  const handleClick = (type) => {
    navigate('/hotels', { state: { destination, type, dates, options } });
    dispatch({ type: "NEW_SEARCH", payload: { type: type } });
    // console.log("Dispatched from Hotel Search List's handleClick");
  };

  return (
    <div>
      {
        loading ? <h1>Loading...</h1> :
          <div className="pList">
            {(data).map((data, index) => (
              <div onClick={() => handleClick(data.type)} className='pListItem' key={index}>
                <img src={photoData[index]}
                  alt=""
                  className="pListImg"
                />
                <div className="pListTitles">
                  <h1>{data?.type}</h1>
                  <h2>{data?.count} {data?.type} properties</h2>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

export default Propertylist