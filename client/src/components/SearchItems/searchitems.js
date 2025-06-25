import { Link } from 'react-router-dom';
import './searchitems.css'

const SearchItems = ({ data }) => {
  // console.log(data);
  return (
    <div className="searchItem">
      <img
        src={data.photos[0]}
        alt=""
        className="siImg"
      />
      <div className="siDesc">
        <h1 className="siTitle">{data.name.slice(0,30)}</h1>
        <span className="siDistance">{data.distance}</span>
        <span className="siTaxiOp">Free airport taxi</span>
        <span className="siSubtitle">
          {data.title.slice(0,50)+"..."}
        </span>
        <span className="siFeatures">
          {data.description.slice(0,100)+"..."}
        </span>
        <span className="siCancelOp">Free cancellation </span>
        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="siDetails">
        <div className="siRating">
          <span>Excellent</span>
          <button>{data.rating}</button>
        </div>
        <div className="siDetailTexts">
          <span className="siPrice">₹{data.cheapestPrice}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <Link to={`/hotel/${data._id}`}>
            <button className="siCheckButton">See availability</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SearchItems