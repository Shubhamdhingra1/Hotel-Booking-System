import express from 'express';
import { createHotel, deleteHotel, getAllCities, getAllCityHotelCount, getCurrentMonthNewHotelCount, getHotel, getHotelCountByCity, getHotelCountByType, getHotelRooms, getHotels, getTotalHotelCount, updateHotel } from '../controllers/hotel.js';
import { verifyAdmin } from '../utils/verification.js';

const router = express.Router();

// CREATE operation
router.post('/:access_token', verifyAdmin, createHotel); //Only admin can create a new Hotel

// READ All
router.get('/', getHotels); // Public access

// READ One by Id
router.get('/id/:id', getHotel); // Public access

// UPDATE
router.patch('/:access_token/id/:id', verifyAdmin, updateHotel); //Only admin can update a Hotel

// DELETE
router.delete('/:access_token/id/:id', verifyAdmin, deleteHotel); //Only admin can delete a Hotel

router.get('/:access_token/totalHotels', verifyAdmin, getTotalHotelCount);
router.get('/:access_token/newHotels', verifyAdmin, getCurrentMonthNewHotelCount);


router.get('/countByCity', getHotelCountByCity); // Public access
router.get('/countByType', getHotelCountByType); // Public access
router.get('/allHotelCountByCity', getAllCityHotelCount); // Public access
router.get('/rooms/:id', getHotelRooms); // Public access
router.get('/allCities', getAllCities); // Public access

export default router;