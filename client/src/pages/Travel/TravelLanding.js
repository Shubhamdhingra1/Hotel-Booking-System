import Navbar from "../../components/Navbar/navbar";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import CarRentalHostCta from "../../components/Travel/CarRentalHostCta";
import "../Home/home.css";

const TravelLanding = ({ activeTab }) => (
  <div className="home pageShell">
    <Navbar />
    <Header
      activeTab={activeTab}
      afterSearch={activeTab === "cars" ? <CarRentalHostCta variant="banner" /> : null}
    />
    <Footer />
  </div>
);

export default TravelLanding;
