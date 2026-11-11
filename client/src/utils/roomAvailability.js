export function dayTimestamp(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Flatten DB values (handles legacy nested date arrays). */
export function flattenUnavailableDates(unavailableDates) {
  const out = [];
  (unavailableDates || []).forEach((entry) => {
    if (Array.isArray(entry)) {
      entry.forEach((d) => out.push(d));
    } else if (entry != null) {
      out.push(entry);
    }
  });
  return out;
}

/**
 * Room is free for the stay if none of the requested nights overlap unavailable nights.
 * Past unavailable nights do not block future stays on other dates.
 */
export function isRoomNumberAvailable(roomNumber, requestedNightTimestamps) {
  const booked = new Set(
    flattenUnavailableDates(roomNumber?.unavailableDates)
      .map(dayTimestamp)
      .filter((t) => t != null)
  );

  return !requestedNightTimestamps.some((night) => booked.has(night));
}

export function getStayNightTimestamps(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];

  const list = [];
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  const endDay = dayTimestamp(end);

  while (dayTimestamp(cursor) != null && dayTimestamp(cursor) <= endDay) {
    list.push(dayTimestamp(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return list;
}
