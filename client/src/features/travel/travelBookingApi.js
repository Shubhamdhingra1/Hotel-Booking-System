import { httpClient } from "../../shared/api/httpClient";

/** Books a flight or car rental. */
export function createTravelBooking(payload) {
  return httpClient.post("/service-booking", payload);
}
