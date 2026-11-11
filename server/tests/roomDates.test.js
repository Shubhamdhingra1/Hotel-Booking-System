import test from "node:test";
import assert from "node:assert/strict";
import { normalizeBookedDates, dayTimestamp } from "../utils/roomDates.js";

test("normalizeBookedDates flattens nested arrays", () => {
    const iso = "2026-06-01T12:00:00.000Z";
    const dates = normalizeBookedDates([[iso], iso]);
    assert.equal(dates.length, 2);
    assert.equal(dates[0].getHours(), 0);
});

test("dayTimestamp aligns to local midnight", () => {
    const t = dayTimestamp("2026-06-01T15:30:00.000Z");
    const d = new Date(t);
    assert.equal(d.getHours(), 0);
    assert.equal(d.getMinutes(), 0);
});
