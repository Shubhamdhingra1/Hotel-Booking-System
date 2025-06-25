import Featured from '../../components/Featured/featured'
import FeaturedProperty from '../../components/FeaturedProperty/featuredproperty'
import Footer from '../../components/Footer/footer'
import Header from '../../components/Header/header'
import MailList from '../../components/MailList/maillist'
import Navbar from '../../components/Navbar/navbar'
import Propertylist from '../../components/PropertyList/propertylist'
import './home.css'

const Home = () => {
  
  
  return (
    <div className='home'>
      <Navbar />
      <Header />
      <div className='homeContainer'>
        <Featured />
        <h1 className="homeTitle">Browse by property type</h1>
        <Propertylist />
        <h1 className="homeTitle">Homes guests love</h1>
        <FeaturedProperty />
      </div>
        <MailList />
        <Footer />
    </div>
  )
}

export default Home