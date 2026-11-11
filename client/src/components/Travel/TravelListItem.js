import { useState } from "react";
import { Link } from "react-router-dom";
import { FALLBACK_CAR_IMAGE } from "../../constants/fallbackImages";
import "./travelItem.css";

const TravelListItem = ({ item, serviceKey, detailPath, priceField, subtitle, priceLabel, linkState }) => {
  const price = item[priceField];
  const initial =
    item.image || item.photos?.[0] || FALLBACK_CAR_IMAGE;
  const [image, setImage] = useState(initial);

  return (
    <div className="searchItem travelItem">
      <img
        src={image}
        alt=""
        className="siImg"
        onError={() => setImage(FALLBACK_CAR_IMAGE)}
      />
      <div className="siDesc">
        <h1 className="siTitle">{item.title || item.model || item.serviceName}</h1>
        <span className="siDistance">{subtitle(item)}</span>
        <span className="siTaxiOp">Free cancellation</span>
        <span className="siFeatures">{item.description || item.vehicleType || ""}</span>
      </div>
      <div className="siDetails">
        <div className="siRating">
          <span>Great</span>
          <button>{item.rating || 4.2}</button>
        </div>
        <div className="siDetailTexts">
          <span className="siPrice">₹{price}</span>
          <span className="siTaxOp">{priceLabel}</span>
          <Link to={detailPath(item._id)} state={linkState}>
            <button className="siCheckButton">View details</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TravelListItem;
