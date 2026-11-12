import { dayTimestamp, normalizeBookedDates } from "./roomDates.js";

/** Flatten stored unavailable nights (supports legacy nested arrays). */
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

export function getRentalNightTimestamps(startDate, endDate) {
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

const bookedSet = (unavailableDates) =>
    new Set(
        flattenUnavailableDates(unavailableDates)
            .map((d) => dayTimestamp(d))
            .filter((t) => t != null)
    );

/** True when each rental night is inside the listing window and not already booked. */
export function isCarAvailableForNights(car, startDate, endDate) {
    const nights = getRentalNightTimestamps(startDate, endDate);
    if (!nights.length) return false;

    const booked = bookedSet(car?.unavailableDates);

    if (car?.isPeerListing) {
        const from = car.listFrom ? dayTimestamp(car.listFrom) : null;
        const until = car.listUntil ? dayTimestamp(car.listUntil) : null;
        if (from == null || until == null) return false;
        const insideWindow = nights.every((night) => night >= from && night <= until);
        if (!insideWindow) return false;
    }

    return !nights.some((night) => booked.has(night));
}

export function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

/** Count days in the listing window (from today) that are not already booked. */
export function countAvailableRentalDays(car) {
    const today = startOfToday();
    let fromTs = dayTimestamp(today);

    if (car?.listFrom) {
        const listFrom = dayTimestamp(car.listFrom);
        if (listFrom != null && listFrom > fromTs) {
            fromTs = listFrom;
        }
    }

    let untilTs = null;
    if (car?.listUntil) {
        untilTs = dayTimestamp(car.listUntil);
    } else if (!car?.isPeerListing) {
        const horizon = new Date(today);
        horizon.setFullYear(horizon.getFullYear() + 1);
        untilTs = dayTimestamp(horizon);
    }

    if (untilTs == null || fromTs == null || fromTs > untilTs) {
        return 0;
    }

    const booked = bookedSet(car?.unavailableDates);
    let count = 0;
    const cursor = new Date(fromTs);
    cursor.setHours(0, 0, 0, 0);

    while (dayTimestamp(cursor) != null && dayTimestamp(cursor) <= untilTs) {
        const ts = dayTimestamp(cursor);
        if (!booked.has(ts)) count += 1;
        cursor.setDate(cursor.getDate() + 1);
    }

    return count;
}

export function hasBookableRentalDays(car) {
    return countAvailableRentalDays(car) > 0;
}
