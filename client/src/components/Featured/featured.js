import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../baseURL/baseURL';
import useFetch from '../../hooks/useFetch';
import './featured.css'
import { useContext } from 'react';
import { SearchContext } from '../../Context/searchContext';

const Featured = () => {

  const { data, loading } = useFetch(`${baseURL}/hotel/countByCity?cities=Delhi,Mumbai,Bangalore`);
  // console.log(data, loading, error);

  const imgList = [
    "https://wallpaperaccess.com/full/1896134.jpg",
    "https://wallpaperaccess.com/full/1180008.jpg",
    "https://assetmonk.com/wp-content/uploads/shutterstock_441579379-min.jpg"
  ];

  const navigate = useNavigate();
  const {  dates, options, dispatch } = useContext(SearchContext);
  const handleClick = (city) => {
    navigate('/hotels', { state: { destination: city, dates, options } });
    dispatch({ type: "NEW_SEARCH", payload: { destination: city } });
    // console.log("Dispatched from Hotel Search List's handleClick");
  };
  return (
    <div>
      {
        loading ? <h1>Loading...</h1> :
          <div className='featured'>
            {data.map((item, i) => (
              <div onClick={() => handleClick(item.city)} className="featuredItem" key={i}>
                <img
                  src={imgList[i]}
                  alt=""
                  className="featuredImg"
                />
                <div className="featuredTitles">
                  <h1>{item.city}</h1>
                  <h2>{item.count} properties</h2>
                </div>
              </div>

            ))}
          </div>}
    </div>
  );
}

export default Featured