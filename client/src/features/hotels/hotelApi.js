import { httpClient } from "../../shared/api/httpClient";

/** Blocks a room number for the given ISO stay dates. */
export function blockRoomAvailability(roomNumberId, dates) {
  return httpClient.patch(`/room/availability/${roomNumberId}`, { dates });
}
