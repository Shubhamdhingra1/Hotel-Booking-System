import { createTravelBooking } from "../../services/travelBookingService.js";
import { validateServiceBookingBody } from "../../validators/bookingValidators.js";

/** HTTP handler for flight and car rental bookings. */
export const bookService = async (req, res, next) => {
    try {
        const payload = validateServiceBookingBody(req.body);
        const booking = await createTravelBooking(payload, req.user.id);
        res.status(201).json({ success: true, booking });
    } catch (error) {
        next(error);
    }
};
