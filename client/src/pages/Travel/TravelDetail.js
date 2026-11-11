import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FiArrowLeft, FiMapPin, FiCalendar } from "react-icons/fi";
import Navbar from "../../components/Navbar/navbar";
import Footer from "../../components/Footer/footer";
import useFetch from "../../hooks/useFetch";
import { baseURL } from "../../baseURL/baseURL";
import { AuthContext } from "../../Context/authContext";
import { TRAVEL_SERVICES } from "../../constants/travelServices";
import PaymentModal, { PaymentSuccessModal } from "../../components/Reserve/PaymentModal";
import { FALLBACK_CAR_IMAGE } from "../../constants/fallbackImages";
import { createTravelBooking } from "../../features/travel/travelBookingApi";
import { getStayNightTimestamps } from "../../utils/roomAvailability";
import {
  clampRentalDatesToBounds,
  getBookedDayDates,
  getCarListingBounds,
  isCarRentalRangeAvailable,
} from "../../utils/carRentalAvailability";
import "./travelDetail.css";

function buildInitialRentalDates(initialDates) {
  const start = initialDates?.[0]?.startDate
    ? new Date(initialDates[0].startDate)
    : new Date();
  const end = initialDates?.[0]?.endDate
    ? new Date(initialDates[0].endDate)
    : new Date(start.getTime() + 86400000);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return [{ startDate: start, endDate: end, key: "selection" }];
}

const TravelDetail = ({ serviceKey }) => {
  const { id } = useParams();
  const location = useLocation();
  const service = TRAVEL_SERVICES[serviceKey];
  const { data, loading, error } = useFetch(`${baseURL}/${service.apiPath}/id/${id}`);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const initialDates = location.state?.dates;
  const [rentalDates, setRentalDates] = useState(() =>
    buildInitialRentalDates(initialDates)
  );
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [passengers, setPassengers] = useState(location.state?.passengers || 1);
  const [heroImage, setHeroImage] = useState(null);
  const [activeGallery, setActiveGallery] = useState(null);

  const galleryImages = useMemo(() => {
    if (serviceKey !== "cars" || !data) return [];
    if (data.images?.length) return data.images;
    if (data.image) return [data.image];
    return [];
  }, [serviceKey, data]);

  const displayImage =
    activeGallery || heroImage || galleryImages[0] || data?.image || FALLBACK_CAR_IMAGE;

  const rentalRange = useMemo(() => {
    if (serviceKey !== "cars") return null;
    const start = new Date(rentalDates[0].startDate);
    const end = new Date(rentalDates[0].endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return { start, end };
  }, [serviceKey, rentalDates]);

  const rentalDayTimestamps = useMemo(() => {
    if (!rentalRange) return [];
    return getStayNightTimestamps(rentalRange.start, rentalRange.end);
  }, [rentalRange]);

  const rentalDays = Math.max(1, rentalDayTimestamps.length || 1);

  const listingBounds = useMemo(() => {
    if (serviceKey !== "cars" || !data) return null;
    return getCarListingBounds(data);
  }, [serviceKey, data]);

  const bookedDayDates = useMemo(() => {
    if (serviceKey !== "cars" || !data) return [];
    return getBookedDayDates(data);
  }, [serviceKey, data]);

  const carAvailable = useMemo(() => {
    if (serviceKey !== "cars" || !data || !rentalRange) return true;
    if (listingBounds?.noSelectableDays) return false;
    return isCarRentalRangeAvailable(data, rentalRange.start, rentalRange.end);
  }, [serviceKey, data, rentalRange, listingBounds?.noSelectableDays]);

  const bookedDayLabels = useMemo(
    () => bookedDayDates.map((d) => format(d, "dd MMM yyyy")),
    [bookedDayDates]
  );

  useEffect(() => {
    if (serviceKey !== "cars" || !data || !listingBounds) return;
    setRentalDates((prev) => clampRentalDatesToBounds(prev, listingBounds));
  }, [data, serviceKey, listingBounds]);

  const handleRentalDatesChange = (item) => {
    const next = [item.selection];
    if (listingBounds) {
      setRentalDates(clampRentalDatesToBounds(next, listingBounds));
    } else {
      setRentalDates(next);
    }
  };

  const unitPrice =
    serviceKey === "cars" ? data?.pricePerDay || 0 : data?.price || 0;
  const totalAmount = useMemo(() => {
    if (serviceKey === "cars") return unitPrice * rentalDays;
    if (serviceKey === "flights") return unitPrice * passengers;
    return unitPrice;
  }, [serviceKey, unitPrice, rentalDays, passengers]);

  const title = useMemo(() => {
    if (!data) return "";
    if (serviceKey === "flights") return `${data.from} → ${data.to}`;
    if (serviceKey === "cars") return `${data.company} ${data.model}`;
    return "";
  }, [data, serviceKey]);

  const pickupText = data?.pickupNote || data?.distance;

  const handleBook = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (serviceKey === "cars" && !carAvailable) {
      window.alert("This car is not available for the dates you selected. Go back and pick other dates.");
      return;
    }
    setShowPayment(true);
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsProcessing(false);
    setShowPayment(false);
    setShowSuccess(true);
  };

  const confirmBooking = async () => {
    const startDate = serviceKey === "cars" ? rentalRange.start : new Date();
    const endDate =
      serviceKey === "cars"
        ? rentalRange.end
        : new Date(startDate);

    await createTravelBooking({
      serviceType: serviceKey === "cars" ? "car" : "flight",
      itemId: id,
      title,
      totalPrice: totalAmount,
      passengers: serviceKey === "flights" ? passengers : 1,
      startDate,
      endDate,
    });
  };

  const handleSuccessDone = async () => {
    try {
      await confirmBooking();
      setShowSuccess(false);
      navigate(service.listPath);
    } catch (err) {
      console.error(err);
      window.alert(
        err.response?.data?.message || "Payment succeeded but booking failed. Try again."
      );
      setShowSuccess(false);
    }
  };

  if (loading) {
    return (
      <div className="travelDetailPage pageShell">
        <Navbar />
        <p className="travelDetailLoading">Loading your selection…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="travelDetailPage pageShell">
        <Navbar />
        <p className="travelDetailLoading">This listing could not be found.</p>
      </div>
    );
  }

  return (
    <div className="travelDetailPage pageShell">
      <Navbar />
      <div className="travelDetailTopBar">
        <Link to={service.listPath} className="travelDetailBack">
          <FiArrowLeft aria-hidden />
          Back to {service.title.toLowerCase()}
        </Link>
      </div>
      <div className="travelDetailHero">
        <img
          src={displayImage}
          alt=""
          onError={() => setHeroImage(FALLBACK_CAR_IMAGE)}
        />
        <div className="travelDetailHeroText">
          <h1>{title}</h1>
          <p>
            {serviceKey === "cars" && data.city ? `${data.city} · ` : ""}
            {service.title}
          </p>
        </div>
      </div>
      {serviceKey === "cars" && galleryImages.length > 1 && (
        <div className="travelDetailGallery">
          {galleryImages.map((src) => (
            <button
              key={src}
              type="button"
              className={`travelDetailGalleryThumb ${activeGallery === src || (!activeGallery && src === galleryImages[0]) ? "active" : ""}`}
              onClick={() => setActiveGallery(src)}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
      <div className="travelDetailBody">
        <div className="travelDetailCard">
          <h2>{serviceKey === "cars" ? "Vehicle details" : "Overview"}</h2>
          {serviceKey === "flights" && (
            <ul>
              <li>
                <strong>Flight:</strong> {data.airline} {data.flightNumber}
              </li>
              <li>
                <strong>Schedule:</strong> {data.departAt} – {data.arriveAt} ({data.duration})
              </li>
              <li>
                <strong>Class:</strong> {data.travelClass}
              </li>
              <li>
                <strong>Seats left:</strong> {data.seatsAvailable}
              </li>
            </ul>
          )}
          {serviceKey === "cars" && (
            <>
              <div className="travelDetailSpecs">
                <span className="travelDetailSpec">{data.category}</span>
                <span className="travelDetailSpec">{data.transmission}</span>
                <span className="travelDetailSpec">{data.seats} seats</span>
                {data.isPeerListing && (
                  <span className="travelDetailSpec peer">Host-listed vehicle</span>
                )}
                {data.rating != null && (
                  <span className="travelDetailSpec">★ {data.rating}</span>
                )}
              </div>
              <ul className="travelDetailInfoGrid">
                <li>
                  <strong>City</strong>
                  <span>{data.city}</span>
                </li>
                <li>
                  <strong>Rental period</strong>
                  <span>
                    {format(rentalRange.start, "dd MMM yyyy")} –{" "}
                    {format(rentalRange.end, "dd MMM yyyy")} ({rentalDays} day
                    {rentalDays > 1 ? "s" : ""})
                  </span>
                </li>
                {listingBounds?.hasListingWindow && (
                  <li>
                    <strong>Availability schedule</strong>
                    <span>
                      {format(listingBounds.listingFrom, "dd MMM yyyy")} –{" "}
                      {format(listingBounds.listingUntil, "dd MMM yyyy")}
                    </span>
                  </li>
                )}
              </ul>
              {pickupText && (
                <div className="travelDetailPickup">
                  <h3>
                    <FiMapPin style={{ verticalAlign: "-2px", marginRight: 6 }} aria-hidden />
                    Pick-up instructions
                  </h3>
                  <p>{pickupText}</p>
                </div>
              )}
              <div className="travelDetailAvailability">
                <div className="travelDetailAvailabilityHead">
                  <h3>
                    <FiCalendar style={{ verticalAlign: "-2px", marginRight: 6 }} aria-hidden />
                    Select rental days
                  </h3>
                  <span className={`travelDetailStatusBadge ${carAvailable ? "ok" : "bad"}`}>
                    {carAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                <p className="travelDetailAvailabilityHint">
                  {listingBounds?.hasListingWindow
                    ? `Choose pick-up and return only within the host’s schedule (${format(
                        listingBounds.listingFrom,
                        "dd MMM yyyy"
                      )} – ${format(listingBounds.listingUntil, "dd MMM yyyy")}).`
                    : "Choose your rental days below."}
                </p>
                {listingBounds?.noSelectableDays ? (
                  <p className="travelDetailAvailabilityStatus travelDetailAvailabilityStatus--bad">
                    This vehicle has no open days left in its listing period.
                  </p>
                ) : (
                  <div className="travelDetailDateRange">
                    <DateRange
                      editableDateInputs
                      onChange={handleRentalDatesChange}
                      moveRangeOnFirstSelection={false}
                      ranges={rentalDates}
                      minDate={listingBounds?.minDate || new Date()}
                      maxDate={listingBounds?.maxDate}
                      disabledDates={bookedDayDates}
                      className="travelDetailDatePicker"
                    />
                  </div>
                )}
                <p className="travelDetailAvailabilityStatus">
                  {listingBounds?.noSelectableDays
                    ? "Booking is not possible until the host extends the listing."
                    : carAvailable
                      ? `All ${rentalDays} selected day${rentalDays > 1 ? "s are" : " is"} open within this schedule.`
                      : "Your range must stay inside the availability schedule and avoid booked days."}
                </p>
                {bookedDayLabels.length > 0 ? (
                  <div className="travelDetailBookedChips">
                    <span className="travelDetailBookedChipsLabel">Already booked:</span>
                    {bookedDayLabels.slice(0, 14).map((label) => (
                      <span key={label} className="travelDetailBookedChip">
                        {label}
                      </span>
                    ))}
                    {bookedDayLabels.length > 14 && (
                      <span className="travelDetailBookedChip">
                        +{bookedDayLabels.length - 14} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="travelDetailBookedDays">No booked days yet — full calendar is open.</p>
                )}
              </div>
            </>
          )}
        </div>
        <div className="travelDetailBook">
          <div className="travelDetailBookInner">
            <span className="travelDetailPrice">₹{unitPrice.toLocaleString("en-IN")}</span>
            <span className="travelDetailPriceHint">{service.priceLabel}</span>
            {serviceKey === "flights" && (
              <label className="travelDetailPassengers">
                Passengers
                <input
                  type="number"
                  min={1}
                  max={data.seatsAvailable}
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                />
              </label>
            )}
            {serviceKey === "cars" && (
              <>
                <div className="travelDetailSummaryRow">
                  <span>Daily rate</span>
                  <span>₹{unitPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="travelDetailSummaryRow">
                  <span>Duration</span>
                  <span>
                    {rentalDays} day{rentalDays > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="travelDetailSummaryDivider" />
              </>
            )}
            <p className="travelDetailTotal">
              <span>Total</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </p>
            <button
              type="button"
              className="travelDetailBtn"
              onClick={handleBook}
              disabled={
                serviceKey === "cars" &&
                (!carAvailable || listingBounds?.noSelectableDays)
              }
            >
              {service.bookLabel}
            </button>
            <p className="travelDetailTrust">Secure checkout · Free cancellation where applicable</p>
          </div>
        </div>
      </div>
      <Footer />
      {showPayment && (
        <PaymentModal
          durationValue={serviceKey === "cars" ? rentalDays : undefined}
          durationLabel="Rental days"
          showDurationRow={serviceKey === "cars"}
          selectedCount={serviceKey === "flights" ? passengers : 1}
          totalAmount={totalAmount}
          isProcessing={isProcessing}
          summaryLines={
            serviceKey === "cars" ? [{ label: "Daily rate", value: `₹${unitPrice}` }] : []
          }
          showCountRow={serviceKey === "flights"}
          countLabel="Passengers"
          backLabel={
            serviceKey === "cars"
              ? "Back to vehicle"
              : serviceKey === "flights"
                ? "Back to flight"
                : "Back"
          }
          nights={serviceKey === "cars" ? rentalDays : 1}
          onClose={() => setShowPayment(false)}
          onPaySuccess={handlePayNow}
        />
      )}
      {showSuccess && (
        <PaymentSuccessModal amount={totalAmount} onDone={handleSuccessDone} />
      )}
    </div>
  );
};

export default TravelDetail;
