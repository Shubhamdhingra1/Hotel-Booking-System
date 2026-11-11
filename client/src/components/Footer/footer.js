import { Link } from "react-router-dom";
import "./footer.css";

const defaultDates = () => [
  { startDate: new Date(), endDate: new Date(), key: "selection" },
];

const defaultOptions = { people: 1 };

const hotelSearch = (destination, type = "") => ({
  destination,
  type,
  dates: defaultDates(),
  options: defaultOptions,
});

const Footer = () => {
  return (
    <div className="footer">
      <div className="fLists">
        <ul className="fList">
          <li className="fListHeading">Stays</li>
          <li>
            <Link className="fListItem" to="/">
              Search stays
            </Link>
          </li>
          <li>
            <Link className="fListItem" to="/hotels" state={hotelSearch("Delhi")}>
              Hotels in Delhi
            </Link>
          </li>
          <li>
            <Link className="fListItem" to="/hotels" state={hotelSearch("Mumbai")}>
              Hotels in Mumbai
            </Link>
          </li>
          <li>
            <Link className="fListItem" to="/hotels" state={hotelSearch("Bangalore")}>
              Hotels in Bangalore
            </Link>
          </li>
          <li>
            <Link className="fListItem" to="/hotels" state={hotelSearch("", "apartment")}>
              Apartments
            </Link>
          </li>
          <li>
            <Link className="fListItem" to="/#featured-hotels">
              Featured properties
            </Link>
          </li>
        </ul>
        <ul className="fList">
          <li className="fListHeading">Travel</li>
          <li>
            <Link className="fListItem" to="/flights">
              Flights
            </Link>
          </li>
          <li>
            <Link className="fListItem" to="/car-rentals">
              Car rentals
            </Link>
          </li>
          <li>
            <Link className="fListItem" to="/flights/list" state={{ from: "Delhi", to: "Mumbai" }}>
              Delhi → Mumbai flights
            </Link>
          </li>
        </ul>
        <ul className="fList">
          <li className="fListHeading">Account</li>
          <li>
            <Link className="fListItem" to="/login">
              Sign in
            </Link>
          </li>
          <li>
            <Link className="fListItem" to="/signUp">
              Register
            </Link>
          </li>
        </ul>
      </div>
      <div className="fText">Copyright © Shubham Dhingra</div>
    </div>
  );
};

export default Footer;
