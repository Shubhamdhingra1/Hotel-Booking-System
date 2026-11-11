import { httpClient } from "../../shared/api/httpClient";

export function submitCarListing(body) {
  return httpClient.post("/car/listings", body);
}

export function fetchMyCarListings() {
  return httpClient.get("/car/listings/mine");
}

export function resubmitCarListing(id, body) {
  return httpClient.patch(`/car/listings/${id}/resubmit`, body);
}
