import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/home'
import './App.css'
import './styles/pageLayout.css'
import Hotels from './pages/List/hotels'
import Hotel from './pages/Hotel/Hotel'
import Login from './pages/Login/login'
import SignUp from './pages/SignUp/signUp'
import UserProfile from './pages/User/user'
import TravelLanding from './pages/Travel/TravelLanding'
import TravelList from './pages/Travel/TravelList'
import TravelDetail from './pages/Travel/TravelDetail'
import ListYourCar from './pages/Travel/ListYourCar'
import MyCarListings from './pages/Travel/MyCarListings'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotel/:id" element={<Hotel />} />

        <Route path="/flights" element={<TravelLanding activeTab="flights" />} />
        <Route path="/flights/list" element={<TravelList serviceKey="flights" />} />
        <Route path="/flights/:id" element={<TravelDetail serviceKey="flights" />} />

        <Route path="/car-rentals" element={<TravelLanding activeTab="cars" />} />
        <Route path="/car-rentals/list" element={<TravelList serviceKey="cars" />} />
        <Route path="/car-rentals/list-your-car" element={<ListYourCar />} />
        <Route path="/car-rentals/my-listings" element={<MyCarListings />} />
        <Route path="/car-rentals/:id" element={<TravelDetail serviceKey="cars" />} />

        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App