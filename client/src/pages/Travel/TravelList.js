import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import Navbar from "../../components/Navbar/navbar";
import Header from "../../components/Header/header";
import useFetch from "../../hooks/useFetch";
import { baseURL } from "../../baseURL/baseURL";
import TravelListItem from "../../components/Travel/TravelListItem";
import CarRentalHostCta from "../../components/Travel/CarRentalHostCta";
import { TRAVEL_SERVICES } from "../../constants/travelServices";
import "../List/hotels.css";
import Footer from "../../components/Footer/footer";

const buildQueryUrl = (serviceKey, filters) => {
  const api = TRAVEL_SERVICES[serviceKey].apiPath;
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== "" && val !== undefined && val !== null) {
      params.set(key, val);
    }
  });
  return `${baseURL}/${api}?${params.toString()}`;
};

const TravelList = ({ serviceKey }) => {
  const service = TRAVEL_SERVICES[serviceKey];
  const location = useLocation();
  const initial = location.state || {};

  const [from, setFrom] = useState(initial.from || "");
  const [to, setTo] = useState(initial.to || "");
  const [city, setCity] = useState(initial.city || "");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(99999);
  const [passengers, setPassengers] = useState(initial.passengers || 1);
  const [dates, setDates] = useState(
    initial.dates || [
      { startDate: new Date(), endDate: new Date(), key: "selection" },
    ]
  );
  const [openDate, setOpenDate] = useState(false);
  const [searchUrl, setSearchUrl] = useState(() =>
    buildQueryUrl(serviceKey, {
      from: initial.from,
      to: initial.to,
      city: initial.city,
      min: 0,
      max: 99999,
    })
  );

  const { data, loading, error } = useFetch(searchUrl);

  const handleSearch = () => {
    const filters = { min, max };
    if (serviceKey === "flights") {
      filters.from = from;
      filters.to = to;
    } else {
      filters.city = city;
      if (dates[0]?.startDate && dates[0]?.endDate) {
        filters.rentFrom = dates[0].startDate.toISOString();
        filters.rentTo = dates[0].endDate.toISOString();
      }
    }
    setSearchUrl(buildQueryUrl(serviceKey, filters));
  };

  const detailLinkState = useMemo(() => {
    if (serviceKey === "cars") {
      return { city, dates };
    }
    return { from, to, dates, passengers };
  }, [serviceKey, city, dates, from, to, passengers]);

  const list = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const subtitle = (item) => {
    if (serviceKey === "flights") {
      return `${item.from} → ${item.to} · ${item.airline} ${item.flightNumber} · ${item.departAt}`;
    }
    return `${item.city} · ${item.company} · ${item.distance || item.category}`;
  };

  const priceField = serviceKey === "cars" ? "pricePerDay" : "price";

  return (
    <div className="searchHotelsPage pageShell">
      <Navbar />
      <Header type="list" activeTab={service.tab} />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">{service.title}</h1>
            {serviceKey === "flights" ? (
              <>
                <div className="lsItem">
                  <label>From</label>
                  <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Delhi" />
                </div>
                <div className="lsItem">
                  <label>To</label>
                  <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Mumbai" />
                </div>
                <div className="lsItem">
                  <label>Passengers</label>
                  <input
                    type="number"
                    min={1}
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                  />
                </div>
              </>
            ) : (
              <div className="lsItem">
                <label>City</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" />
              </div>
            )}
            <div className="lsItem lsItem--dates">
              <label>
                {serviceKey === "flights"
                  ? "Travel dates"
                  : "Rental days (pick-up – return)"}
              </label>
              <span className="dateInput" onClick={() => setOpenDate(!openDate)}>
                {`${format(dates[0].startDate, "dd/MM/yyyy")} to ${format(
                  dates[0].endDate,
                  "dd/MM/yyyy"
                )}`}
              </span>
              {openDate && (
                <div className="lsDateRangeWrap">
                  <DateRange
                    onChange={(item) => setDates([item.selection])}
                    minDate={new Date()}
                    ranges={dates}
                    months={1}
                    direction="vertical"
                    showDateDisplay={false}
                    rangeColors={["#003580"]}
                    className="lsDateRangePicker"
                  />
                </div>
              )}
            </div>
            <div className="lsItem">
              <label>Price range (₹)</label>
              <div className="lsPriceRow">
                <input
                  type="number"
                  className="lsOptionInput"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  aria-label="Minimum price"
                />
                <input
                  type="number"
                  className="lsOptionInput"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  aria-label="Maximum price"
                />
              </div>
            </div>
            <button type="button" onClick={handleSearch}>
              Search
            </button>
            {serviceKey === "cars" && <CarRentalHostCta variant="compact" />}
          </div>
          <div className="listResult">
            {loading && !error && <h1>Loading...</h1>}
            {error && <h1>Something went wrong. Is the API running?</h1>}
            {!loading && !error && (
              <>
                {list.length === 0 && <p>No results. Try clearing filters or another city.</p>}
                {list.map((item) => (
                  <TravelListItem
                    key={item._id}
                    linkState={detailLinkState}
                    item={{
                      ...item,
                      title:
                        serviceKey === "cars" && item.company
                          ? `${item.company} — ${item.model}`
                          : item.title || item.model || item.serviceName,
                      description:
                        serviceKey === "flights"
                          ? `${item.travelClass} · ${item.duration}`
                          : serviceKey === "cars"
                            ? `${item.category} · ${item.transmission} · ${item.seats} seats`
                            : `${item.vehicleType} · Meet & greet included`,
                    }}
                    serviceKey={serviceKey}
                    detailPath={service.detailPath}
                    priceField={priceField}
                    subtitle={subtitle}
                    priceLabel={service.priceLabel}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TravelList;
