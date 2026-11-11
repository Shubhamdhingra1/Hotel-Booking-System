import test from "node:test";
import assert from "node:assert/strict";
import { canAccommodateParty } from "../utils/hotelCapacity.js";

const mockRooms = [
    {
        maxPeople: 4,
        roomNumbers: [{}, {}, {}],
    },
    {
        maxPeople: 2,
        roomNumbers: [{}],
    },
];

test("canAccommodateParty allows party that fits across rooms", () => {
    assert.equal(canAccommodateParty(mockRooms, 10), true);
});

test("canAccommodateParty rejects party exceeding capacity", () => {
    assert.equal(canAccommodateParty(mockRooms, 20), false);
});
