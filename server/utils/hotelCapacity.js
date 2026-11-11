/**
 * True if the hotel's rooms can host `people` guests in one stay
 * (guests split across physical rooms, each room capped by maxPeople).
 */
export function canAccommodateParty(roomDocs, people) {
  const partySize = Math.max(1, Number(people) || 1);
  const capacities = [];

  for (const room of roomDocs || []) {
    const unitCap = Number(room.maxPeople) || 0;
    const count = room.roomNumbers?.length || 0;
    for (let i = 0; i < count; i += 1) {
      if (unitCap > 0) capacities.push(unitCap);
    }
  }

  if (capacities.length === 0) return false;

  capacities.sort((a, b) => b - a);
  let remaining = partySize;
  for (const cap of capacities) {
    remaining -= Math.min(remaining, cap);
    if (remaining <= 0) return true;
  }
  return false;
}

export async function filterHotelsByGuestCount(hotels, people, Room) {
  const partySize = Math.max(1, Number(people) || 1);
  if (!hotels?.length) return [];

  const allRoomIds = [
    ...new Set(hotels.flatMap((h) => h.rooms || []).filter(Boolean)),
  ];
  if (!allRoomIds.length) return [];

  const roomDocs = await Room.find({ _id: { $in: allRoomIds } });
  const roomById = new Map(roomDocs.map((r) => [String(r._id), r]));

  return hotels.filter((hotel) => {
    const rooms = (hotel.rooms || [])
      .map((id) => roomById.get(String(id)))
      .filter(Boolean);
    return canAccommodateParty(rooms, partySize);
  });
}
