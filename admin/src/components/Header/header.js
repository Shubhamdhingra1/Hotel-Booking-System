import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';
import { baseURL } from '../../baseURL/baseURL';
import axios from 'axios';

const Header = () => {
    const location = useLocation();

    const [hotels, setHotels] = useState([]);
    const [users, setUsers] = useState([]);

    const getData = async () => {
        const access_token = localStorage.getItem('access_token');
        try {
            const hotelResponse = await axios.get(`${baseURL}/hotel`);
            setHotels(hotelResponse.data);
            const userResponse = await axios.get(`${baseURL}/user/${access_token}`);
            setUsers(userResponse.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getData();
    }, [])

    const [searchQuery, setSearchQuery] = useState('');
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [hotelSuggestions, setHotelSuggestions] = useState([]);
    const [openSuggestions, setOpenSuggestions] = useState([]);

    const handleSearchQueryChange = (event) => {
        setOpenSuggestions(true);
        setSearchQuery(event.target.value);
        if (event.target.value === "") {
            setUserSuggestions([]);
            setHotelSuggestions([]);
            setOpenSuggestions(false);
        }
        setHotelSuggestions(hotels?.filter((hotel) => {
            return hotel?.name?.toLowerCase().includes(event.target.value?.toLowerCase());
        }));
        setUserSuggestions(users?.filter((user) => {
            return user?.username?.toLowerCase().includes(event.target.value?.toLowerCase());
        }));
    };

    const handleSuggestionClick = (suggestion) => {
        setOpenSuggestions(false);
    };

    return (
        <div className='header'>
            <nav>
                <ul>
                    <li className={location.pathname === '/' ? 'active' : ''}>
                        <Link to="/">Dashboard</Link>
                    </li>
                    <li className={location.pathname === '/hotels' ? 'active' : ''}>
                        <Link to="/hotels">Hotels</Link>
                    </li>
                    <li className={location.pathname === '/users' ? 'active' : ''}>
                        <Link to="/users">Users</Link>
                    </li>
                </ul>
                <div className='searchBar'>
                    <div className='search'>
                        <input
                            type="text"
                            id='searchInput'
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            placeholder="Search..."
                            className="headerSearchInput"
                        />
                        {/* <button className='createButton'>search</button> */}
                    </div>
                    {openSuggestions && ((userSuggestions.length > 0) || (hotelSuggestions.length > 0)) &&
                        <div className='searchSuggestionsContainerWrapper'>
                            <div className='searchSuggestionsContainer'>
                                {(userSuggestions.length > 0) && (
                                    <div className="suggestions">
                                        <p className='suggestionHeading'>Users</p>
                                        <ul className="searchSuggestionList">
                                            {userSuggestions.slice(0, 10).map((user, i) => (
                                                <li
                                                    key={i}
                                                    onClick={() => handleSuggestionClick(user)}
                                                    className="searchSuggestion"
                                                >
                                                    <Link to={`/user/${user._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                                        {user.username}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {(hotelSuggestions.length > 0) && (
                                    <div className="suggestions">
                                        <p className='suggestionHeading'>Hotels</p>
                                        <ul className="searchSuggestionList">
                                            {hotelSuggestions.slice(0, 10).map((hotel, i) => (
                                                <li
                                                    key={i}
                                                    onClick={() => handleSuggestionClick(hotel)}
                                                    className="searchSuggestion"
                                                >
                                                    <Link to={`/hotels/update/${hotel._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                                        {hotel.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>}
                </div>
            </nav>
        </div>
    );
};

export default Header;
