/** Cabin layout geometry — no booking state. */
export const SEAT_LETTERS_LEFT = ["A", "B", "C"];
export const SEAT_LETTERS_RIGHT = ["D", "E", "F"];
export const DEFAULT_TOTAL_SEATS = 36;

export function seatId(row, letter) {
    return `${row}${letter}`;
}

export function allSeatIdsForCapacity(totalSeats = DEFAULT_TOTAL_SEATS) {
    const rows = Math.ceil(totalSeats / 6);
    const ids = [];
    for (let row = 1; row <= rows; row++) {
        [...SEAT_LETTERS_LEFT, ...SEAT_LETTERS_RIGHT].forEach((letter) => {
            const id = seatId(row, letter);
            if (ids.length < totalSeats) ids.push(id);
        });
    }
    return ids;
}

export function getFlightCapacity(flight) {
    const total = Number(flight?.totalSeats) || DEFAULT_TOTAL_SEATS;
    return Math.max(6, total);
}
