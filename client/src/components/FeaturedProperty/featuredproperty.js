import { baseURL } from '../../baseURL/baseURL';
import useFetch from '../../hooks/useFetch';
import { Link} from 'react-router-dom'
import './featuredproperty.css';

const FeaturedProperty = () => {


  const { data, loading, error } = useFetch(`${baseURL}/hotel?featured=true&limit=3`);
  // console.log(error);
  // console.log(data);
  return (
    <div className='fpWrapper'>
      {
        !error && loading ? <h1>Loading...</h1> :
          <div className="fp">
            {(data).map((data, index) => (
              <Link to={`/hotel/${data._id}` } className="fpItem" key={index}>
                <img
                  src={data.photos[0]}
                  alt=""
                  className="fpImg"
                />
                <span className="fpName">{data.name}</span>
                <span className="fpCity">{data.city}</span>
                <span className="fpPrice">Starting from ₹{data.cheapestPrice}/-</span>
                <div className="fpRating">
                  <button>{data.rating}</button>
                  <span>Excellent</span>
                </div>
              </Link>
            ))}
          </div>
      }
    </div>
  )
}

export default FeaturedProperty