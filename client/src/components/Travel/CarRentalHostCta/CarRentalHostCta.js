import { Link } from "react-router-dom";
import { FiCalendar, FiCheckCircle, FiList, FiShield, FiArrowRight } from "react-icons/fi";
import "./carRentalHostCta.css";

const FEATURES = [
  { icon: FiShield, text: "Admin-verified listings" },
  { icon: FiCalendar, text: "You choose how long it stays live" },
  { icon: FiCheckCircle, text: "Calendar-based availability" },
];

/**
 * Prompt for peer car hosts — full banner on landing, compact strip on list search.
 * @param {{ variant?: 'banner' | 'compact' }} props
 */
const CarRentalHostCta = ({ variant = "banner" }) => {
  if (variant === "compact") {
    return (
      <aside className="carHostCta carHostCta--compact" aria-label="List your vehicle">
        <p className="carHostCtaCompactText">Own a car?</p>
        <div className="carHostCtaCompactActions">
          <Link to="/car-rentals/list-your-car" className="carHostCtaBtn carHostCtaBtn--primary carHostCtaBtn--sm">
            List your car
          </Link>
          <Link to="/car-rentals/my-listings" className="carHostCtaBtn carHostCtaBtn--ghost carHostCtaBtn--sm">
            My listings
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <section
      className="carHostCtaBanner carHostCta--banner"
      aria-labelledby="car-host-cta-title"
    >
        <div className="carHostCtaBannerGrid">
          <div className="carHostCtaBannerCopy">
            <span className="carHostCtaEyebrow">Become a host</span>
            <h2 id="car-host-cta-title" className="carHostCtaTitle">
              Have a car to rent?
            </h2>
            <p className="carHostCtaSubtitle">
              Submit your vehicle for admin approval, set your listing window, and manage bookings
              with the same night-by-night availability renters expect from hotel stays.
            </p>
            <ul className="carHostCtaFeatures">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text}>
                  <Icon aria-hidden className="carHostCtaFeatureIcon" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="carHostCtaBannerActions">
            <Link to="/car-rentals/list-your-car" className="carHostCtaBtn carHostCtaBtn--primary">
              List your car
              <FiArrowRight aria-hidden />
            </Link>
            <Link to="/car-rentals/my-listings" className="carHostCtaBtn carHostCtaBtn--secondary">
              <FiList aria-hidden />
              My listings
            </Link>
          </div>
        </div>
    </section>
  );
};

export default CarRentalHostCta;
