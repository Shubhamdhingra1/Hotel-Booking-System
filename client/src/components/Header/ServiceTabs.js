import { FaBed, FaPlane, FaCar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SERVICE_TABS } from "../../constants/travelServices";

const ICONS = {
  stays: FaBed,
  flights: FaPlane,
  cars: FaCar,
};

const ServiceTabs = ({ activeTab = "stays" }) => {
  const navigate = useNavigate();

  return (
    <div className="headerList">
      {SERVICE_TABS.map((tab) => {
        const Icon = ICONS[tab.id];
        return (
          <div
            key={tab.id}
            className={`headerListItems${activeTab === tab.id ? " active" : ""}`}
            onClick={() => navigate(tab.path)}
            onKeyDown={(e) => e.key === "Enter" && navigate(tab.path)}
            role="button"
            tabIndex={0}
          >
            <Icon />
            <span>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceTabs;
