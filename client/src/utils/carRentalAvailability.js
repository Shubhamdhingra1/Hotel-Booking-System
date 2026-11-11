import {
  dayTimestamp,
  flattenUnavailableDates,
  getStayNightTimestamps,
  isRoomNumberAvailable,
} from "./roomAvailability";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/** Selectable calendar bounds for this vehicle (listing window ∩ not before today). */
export function getCarListingBounds(car) {
  const today = startOfToday();
  const listingFrom = car?.listFrom ? new Date(car.listFrom) : null;
  const listingUntil = car?.listUntil ? new Date(car.listUntil) : null;
  if (listingFrom) listingFrom.setHours(0, 0, 0, 0);
  if (listingUntil) listingUntil.setHours(0, 0, 0, 0);

  const requiresWindow = Boolean(car?.isPeerListing);

  if (requiresWindow && (!listingFrom || !listingUntil)) {
    return {
      minDate: today,
      maxDate: today,
      listingFrom,
      listingUntil,
      hasListingWindow: false,
      noSelectableDays: true,
    };
  }

  let minDate = listingFrom
    ? listingFrom.getTime() > today.getTime()
      ? listingFrom
      : today
    : today;

  let maxDate = listingUntil;
  if (!maxDate) {
    maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() + 1);
  }

  const noSelectableDays = minDate.getTime() > maxDate.getTime();

  return {
    minDate: noSelectableDays ? maxDate : minDate,
    maxDate,
    listingFrom,
    listingUntil,
    hasListingWindow: Boolean(listingFrom && listingUntil),
    noSelectableDays,
  };
}

export function getBookedDayDates(car) {
  return flattenUnavailableDates(car?.unavailableDates)
    .map((d) => dayTimestamp(d))
    .filter((t) => t != null)
    .sort((a, b) => a - b)
    .map((t) => new Date(t));
}

/** Rental range must fall inside the listing window and avoid booked days. */
export function isCarRentalRangeAvailable(car, startDate, endDate) {
  const days = getStayNightTimestamps(startDate, endDate);
  if (!days.length) return false;

  if (!isRoomNumberAvailable({ unavailableDates: car?.unavailableDates }, days)) {
    return false;
  }

  const from = car?.listFrom ? dayTimestamp(car.listFrom) : null;
  const until = car?.listUntil ? dayTimestamp(car.listUntil) : null;

  if (car?.isPeerListing) {
    if (from == null || until == null) return false;
    return days.every((d) => d >= from && d <= until);
  }

  if (from != null && until != null) {
    return days.every((d) => d >= from && d <= until);
  }

  return true;
}

export function clampRentalDatesToBounds(range, bounds) {
  const selection = range?.[0] || {
    startDate: bounds.minDate,
    endDate: bounds.minDate,
    key: "selection",
  };

  if (bounds.noSelectableDays) {
    return [
      {
        startDate: new Date(bounds.maxDate),
        endDate: new Date(bounds.maxDate),
        key: selection.key || "selection",
      },
    ];
  }

  let start = new Date(selection.startDate);
  let end = new Date(selection.endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const { minDate, maxDate } = bounds;

  if (start < minDate) start = new Date(minDate);
  if (end > maxDate) end = new Date(maxDate);
  if (start > maxDate) start = new Date(maxDate);
  if (end < minDate) end = new Date(minDate);
  if (end < start) end = new Date(start);

  return [{ startDate: start, endDate: end, key: selection.key || "selection" }];
}
