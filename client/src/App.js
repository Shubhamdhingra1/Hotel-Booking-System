import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/home'
import './App.css'
import Hotels from './pages/List/hotels'
import Hotel from './pages/Hotel/Hotel'
import Login from './pages/Login/login'
import SignUp from './pages/SignUp/signUp'
import UserProfile from './pages/User/user'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotel/:id" element={<Hotel />} />

        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App