import Flight from "../models/flight.js";
import { initialFlightSeatFields } from "../services/flightSeatInventory.js";
import CarRental from "../models/carRental.js";

const IMG_PLANE =
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800";
const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

/** Verified HTTP 200 — vehicle / automotive only (no hotels or interiors). */
const CAR_ONLY = {
    mercedesSedan: img("photo-1618843479313-40f8afb4b4d8"),
    bmwSedan: img("photo-1555215695-3004980ad54e"),
    audiSuv: img("photo-1606664515524-ed2f786a0bd6"),
    blackSedan: img("photo-1549317661-bd32c8ce0db2"),
    sportsCoupe: img("photo-1492144534655-ae79c964c9d7"),
    whiteSedan: img("photo-1502877338535-766e1452684a"),
    luxuryParked: img("photo-1617788138017-80ad40651399"),
    roadCar: img("photo-1550355291-bbee04a92027"),
};

const CITIES = ["Delhi", "Mumbai", "Bangalore"];

const FLIGHT_TEMPLATES = [
    { airline: "SkyWays", departAt: "06:15", arriveAt: "08:30", duration: "2h 15m", travelClass: "Economy", basePrice: 4100 },
    { airline: "IndiGo", departAt: "09:45", arriveAt: "12:00", duration: "2h 15m", travelClass: "Economy", basePrice: 4800 },
    { airline: "Air India", departAt: "13:20", arriveAt: "15:35", duration: "2h 15m", travelClass: "Premium Economy", basePrice: 6200 },
    { airline: "Vistara", departAt: "17:00", arriveAt: "19:10", duration: "2h 10m", travelClass: "Economy", basePrice: 5500 },
    { airline: "Akasa Air", departAt: "21:30", arriveAt: "23:45", duration: "2h 15m", travelClass: "Business", basePrice: 8900 },
];

const CAR_TEMPLATES = [
    {
        company: "Hertz",
        model: "Mercedes-Benz C-Class",
        category: "Luxury Sedan",
        seats: 5,
        transmission: "Automatic",
        pricePerDay: 6200,
        distance: "Terminal 3 pick-up desk",
        image: CAR_ONLY.mercedesSedan,
        rating: 4.8,
    },
    {
        company: "Avis",
        model: "BMW 5 Series",
        category: "Executive Sedan",
        seats: 5,
        transmission: "Automatic",
        pricePerDay: 7500,
        distance: "Downtown premium branch",
        image: CAR_ONLY.bmwSedan,
        rating: 4.9,
    },
    {
        company: "Sixt",
        model: "Audi Q7",
        category: "Luxury SUV",
        seats: 7,
        transmission: "Automatic",
        pricePerDay: 9800,
        distance: "Airport arrivals lounge",
        image: CAR_ONLY.audiSuv,
        rating: 4.7,
    },
    {
        company: "Enterprise",
        model: "Toyota Camry Hybrid",
        category: "Premium Sedan",
        seats: 5,
        transmission: "Automatic",
        pricePerDay: 4200,
        distance: "City center — free shuttle",
        image: CAR_ONLY.whiteSedan,
        rating: 4.6,
    },
    {
        company: "Zoomcar",
        model: "Range Rover Sport",
        category: "Flagship SUV",
        seats: 5,
        transmission: "Automatic",
        pricePerDay: 12500,
        distance: "VIP valet at 5-star hotels",
        image: CAR_ONLY.sportsCoupe,
        rating: 4.9,
    },
];

const otherCities = (city) => CITIES.filter((c) => c !== city);

const buildFlights = () => {
    const flights = [];
    CITIES.forEach((from, cityIndex) => {
        const destinations = [...otherCities(from), ...otherCities(from), otherCities(from)[0]];
        FLIGHT_TEMPLATES.forEach((tpl, i) => {
            const to = destinations[i];
            const code = `${from.slice(0, 2)}${to.slice(0, 2)}${i + 1}`.toUpperCase();
            flights.push({
                from,
                to,
                airline: tpl.airline,
                flightNumber: `${tpl.airline === "IndiGo" ? "6E" : "SW"}${code}`,
                departAt: tpl.departAt,
                arriveAt: tpl.arriveAt,
                duration: tpl.duration,
                price: tpl.basePrice + cityIndex * 150,
                ...initialFlightSeatFields(36),
                travelClass: tpl.travelClass,
                image: IMG_PLANE,
                rating: 4.1 + i * 0.1,
            });
        });
    });
    return flights;
};

const buildCars = () => {
    const cars = [];
    CITIES.forEach((city, cityIndex) => {
        CAR_TEMPLATES.forEach((tpl) => {
            cars.push({
                city,
                company: tpl.company,
                model: tpl.model,
                category: tpl.category,
                seats: tpl.seats,
                transmission: tpl.transmission,
                distance: tpl.distance,
                pricePerDay: tpl.pricePerDay + cityIndex * 120,
                image: tpl.image,
                rating: tpl.rating,
                isPeerListing: false,
                listingStatus: "approved",
                unavailableDates: [],
            });
        });
    });
    return cars;
};

export const getTravelSeedPayload = () => ({
    flights: buildFlights(),
    cars: buildCars(),
});

/** Reseed car rentals (5 per city × 3 cities). */
export const reseedCarRentals = async () => {
    const cars = buildCars();
    await CarRental.deleteMany({});
    await CarRental.insertMany(cars);
    console.log(`Car rentals seeded: ${cars.length} (5 each in Delhi, Mumbai, Bangalore).`);
};

export const reseedTravelData = async () => {
    const { flights, cars } = getTravelSeedPayload();
    await Promise.all([Flight.deleteMany({}), CarRental.deleteMany({})]);
    await Flight.insertMany(flights);
    await CarRental.insertMany(cars);
    console.log(
        `Travel data seeded: ${flights.length} flights, ${cars.length} cars (5 per city × 3 cities each).`
    );
};

export const seedTravelIfEmpty = async () => {
    try {
        const [flightCount, carCount] = await Promise.all([
            Flight.countDocuments(),
            CarRental.countDocuments(),
        ]);

        if (flightCount === 0 && carCount === 0) {
            await reseedTravelData();
            return;
        }

        const needReseed = flightCount < 15 || carCount < 15;
        if (needReseed) {
            console.log("Travel collections incomplete — reseeding to 5 per city...");
            await reseedTravelData();
        }
    } catch (err) {
        console.error("Travel seed skipped:", err.message);
    }
};
