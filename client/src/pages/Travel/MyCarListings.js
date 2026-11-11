import { useCallback, useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/navbar";
import Footer from "../../components/Footer/footer";
import { AuthContext } from "../../Context/authContext";
import { fetchMyCarListings } from "../../features/travel/carListingApi";
import {
  flattenUnavailableDates,
  dayTimestamp,
} from "../../utils/roomAvailability";
import "./listYourCar.css";
import "./myCarListings.css";

const statusLabel = {
  pending: "Awaiting admin approval",
  approved: "Live on car rentals",
  rejected: "Rejected",
  needs_reapproval: "Listing period ended — resubmit",
  expired: "Expired — resubmit",
};

const MyCarListings = () => {
  const { user } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetchMyCarListings();
      setListings(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (!user) {
    return (
      <div className="listYourCarPage pageShell">
        <Navbar />
        <div className="listYourCarMain">
          <p>Log in to see your listings.</p>
          <Link to="/login">Log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="listYourCarPage pageShell">
      <Navbar />
      <div className="listYourCarMain myCarListingsMain">
        <h1>My car listings</h1>
        <Link to="/car-rentals/list-your-car" className="listYourCarLink">
          + List another car
        </Link>
        {loading && <p>Loading…</p>}
        {!loading && listings.length === 0 && (
          <p>You have not submitted any cars yet.</p>
        )}
        <ul className="myCarListingsList">
          {listings.map((item) => {
            const booked = flattenUnavailableDates(item.unavailableDates)
              .map(dayTimestamp)
              .filter((t) => t != null);
            const bookedCount = booked.length;
            return (
              <li key={item._id} className="myCarListingCard">
                <div className="myCarListingHead">
                  <strong>
                    {item.model} · {item.city}
                  </strong>
                  <span className={`myCarStatus myCarStatus-${item.listingStatus}`}>
                    {statusLabel[item.listingStatus] || item.listingStatus}
                  </span>
                </div>
                <p>
                  ₹{item.pricePerDay}/day · {item.listingStatus === "approved" ? "Listed" : "Requested"}{" "}
                  {item.listFrom && item.listUntil
                    ? `${format(new Date(item.listFrom), "dd MMM yyyy")} – ${format(
                        new Date(item.listUntil),
                        "dd MMM yyyy"
                      )}`
                    : ""}
                </p>
                <p className="myCarBooked">
                  {bookedCount === 0
                    ? "No rental days booked yet — full calendar open for renters."
                    : `${bookedCount} day(s) already booked — those dates show as unavailable to renters.`}
                </p>
                {item.adminNote && (
                  <p className="myCarAdminNote">Admin: {item.adminNote}</p>
                )}
                {(item.listingStatus === "pending" ||
                  item.listingStatus === "needs_reapproval" ||
                  item.listingStatus === "expired" ||
                  item.listingStatus === "rejected") && (
                  <Link className="listYourCarLink" to={`/car-rentals/list-your-car?resubmit=${item._id}`}>
                    {item.listingStatus === "pending"
                      ? "Add photos & documents"
                      : "Resubmit for approval"}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default MyCarListings;
