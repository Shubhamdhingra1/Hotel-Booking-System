/** Normalize booked nights to start-of-day Date objects. */
export function normalizeBookedDates(rawDates) {
    if (!Array.isArray(rawDates)) return [];
    const flat = [];
    rawDates.forEach((entry) => {
        if (Array.isArray(entry)) {
            entry.forEach((d) => flat.push(d));
        } else if (entry != null) {
            flat.push(entry);
        }
    });
    return flat
        .map((d) => {
            const date = new Date(d);
            if (Number.isNaN(date.getTime())) return null;
            date.setHours(0, 0, 0, 0);
            return date;
        })
        .filter(Boolean);
}

export function dayTimestamp(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}
