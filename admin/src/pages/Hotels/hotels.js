import { Link } from 'react-router-dom';
import { baseURL } from '../../baseURL/baseURL';
import Navbar from '../../components/Navbar/navbar';
import useFetch from '../../hooks/useFetch';
import './hotels.css';
import Header from '../../components/Header/header';

const Hotels = () => {

  const { data, loading, error } = useFetch(`${baseURL}/hotel`);
  if (error) { console.log(error) }

  return (
    <div className='hotelPage'>
      <Navbar />
      <Header/>
      <div className='content'>
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          <div className='hotelContainer'>
            {data?.map((hotel) => (
              <Link to={`/hotels/update/${hotel._id}`} className='hotelCard' key={hotel._id}>
                <div className='hotelImageWrapper'>
                  <img
                    className='hotelImage'
                    src={hotel.photos[0] || 'https://cdn3.iconfinder.com/data/icons/map/500/hotel-512.png'}
                    alt=''
                  />
                </div>
                <div className='infoContainer'>
                  <div className='hotelName'>{hotel.name}</div>
                  <div className='hotelType'>{hotel.type}</div>
                  <div className='hotelTitle'>{hotel.title}</div>
                  <div className='hotelAddress'>{hotel.address}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );

}

export default Hotels