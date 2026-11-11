export const TRAVEL_SERVICES = {
  flights: {
    tab: "flights",
    listPath: "/flights/list",
    detailPath: (id) => `/flights/${id}`,
    apiPath: "flight",
    title: "Flights",
    priceLabel: "per person",
    bookLabel: "Book flight",
  },
  cars: {
    tab: "cars",
    listPath: "/car-rentals/list",
    detailPath: (id) => `/car-rentals/${id}`,
    apiPath: "car",
    title: "Car rentals",
    priceLabel: "per day",
    bookLabel: "Book car",
  },
};

export const SERVICE_TABS = [
  { id: "stays", label: "Stays", path: "/" },
  { id: "flights", label: "Flights", path: "/flights" },
  { id: "cars", label: "Car rentals", path: "/car-rentals" },
];
