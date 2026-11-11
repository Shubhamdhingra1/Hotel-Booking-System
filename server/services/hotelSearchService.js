import Hotel from "../models/hotel.js";
import Room from "../models/room.js";
import { filterHotelsByGuestCount } from "../utils/hotelCapacity.js";

/**
 * Builds a Mongoose query for hotel list filters (city, type, price).
 */
export function buildHotelListQuery({ min, max, city, type, otherDetails = {} }) {
    const query = {
        ...otherDetails,
        cheapestPrice: { $gt: min || -1, $lt: max || 999999 },
    };

    if (city !== undefined && city !== "") query.city = city;
    if (type !== undefined && type !== "" && type !== "undefined") query.type = type;

    return query;
}

/**
 * Returns hotels matching search filters and optional guest-count capacity.
 */
export async function searchHotels({ min, max, limit, city, type, people, otherDetails }) {
    const partySize = Math.max(0, parseInt(people, 10) || 0);
    const query = buildHotelListQuery({ min, max, city, type, otherDetails });

    let hotels = await Hotel.find(query).limit(Number(limit) || 50);

    if (partySize > 0) {
        hotels = await filterHotelsByGuestCount(hotels, partySize, Room);
    }

    return hotels;
}
