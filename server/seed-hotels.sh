#!/bin/bash
set -e
BASE="http://localhost:8080/api/v1"

# Local dev: admin JWT (re-login when it expires)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZjQzOTQwZDliMjAxMzgzZTg2ZWQ1MSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc5NDM5MDY2NH0.oqm_noYFG_GVLaVmK1e1Jr5sBSUHDu-Ab9PysVrGYJQ"
TAJ_HOTEL_ID="6af43af7d9b201383e86ed7c"

echo "Using hardcoded admin token."

IMG1="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
IMG2="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"

AUTH_HEADER="Authorization: Bearer $TOKEN"

create_hotel() {
  local json="$1"
  curl -s -X POST "$BASE/hotel" \
    -H "Content-Type: application/json" \
    -H "$AUTH_HEADER" \
    -d "$json" | python3 -c "import sys,json; print(json.load(sys.stdin)['_id'])"
}

create_room() {
  local hotel_id="$1"
  local body="$2"
  curl -s -X POST "$BASE/room/hotel/$hotel_id" \
    -H "Content-Type: application/json" \
    -H "$AUTH_HEADER" \
    -d "$body" > /dev/null
  echo "  Room added."
}

add_rooms_for_hotel() {
  local HID="$1"
  local prefix="$2"   # e.g. 1 -> 101-105, 201-205, 301-305
  create_room "$HID" "{
    \"title\": \"Standard Room\",
    \"price\": 3500,
    \"maxPeople\": 2,
    \"description\": \"Comfortable standard room with essentials.\",
    \"roomNumbers\": [
      {\"number\": $((prefix*100+1)), \"unavailableDates\": []},
      {\"number\": $((prefix*100+2)), \"unavailableDates\": []},
      {\"number\": $((prefix*100+3)), \"unavailableDates\": []},
      {\"number\": $((prefix*100+4)), \"unavailableDates\": []},
      {\"number\": $((prefix*100+5)), \"unavailableDates\": []}
    ]
  }"
  create_room "$HID" "{
    \"title\": \"Deluxe Room\",
    \"price\": 5500,
    \"maxPeople\": 3,
    \"description\": \"Spacious deluxe room with premium amenities.\",
    \"roomNumbers\": [
      {\"number\": $((prefix*100+11)), \"unavailableDates\": []},
      {\"number\": $((prefix*100+12)), \"unavailableDates\": []},
      {\"number\": $((prefix*100+13)), \"unavailableDates\": []},
      {\"number\": $((prefix*100+14)), \"unavailableDates\": []},
      {\"number\": $((prefix*100+15)), \"unavailableDates\": []}
    ]
  }"
  create_room "$HID" "{
    \"title\": \"Suite\",
    \"price\": 9500,
    \"maxPeople\": 4,
    \"description\": \"Large suite with living area and best views.\",
    \"roomNumbers\": [
      {\"number\": $((prefix*100+21)), \"unavailableDates\": []},
      {\"number\": $((prefix*100+22)), \"unavailableDates\": []},
      {\"number\": $((prefix*100+23)), \"unavailableDates\": []},
      {\"number\": $((prefix*100+24)), \"unavailableDates\": []},
      {\"number\": $((prefix*100+25)), \"unavailableDates\": []}
    ]
  }"
}

# Creates 5 hotels per city: 3 room types × 5 room numbers each (same pattern as before).
# Usage: seed_city_five "Delhi" "10|Name|type|true" ...
seed_city_five() {
  local CITY="$1"
  shift
  for entry in "$@"; do
    IFS='|' read -r pref name typ feat <<< "$entry"
    echo "Creating $CITY hotel: $name"
    HID=$(create_hotel "{
      \"name\": \"$name\",
      \"type\": \"$typ\",
      \"city\": \"$CITY\",
      \"address\": \"Central $CITY\",
      \"distance\": \"1-3 km from downtown\",
      \"photos\": [\"$IMG1\", \"$IMG2\"],
      \"title\": \"Stay in $CITY — $name\",
      \"description\": \"Well-rated property in $CITY.\",
      \"rating\": 4.2,
      \"cheapestPrice\": 3500,
      \"featured\": $feat,
      \"rooms\": []
    }")
    echo "  Hotel ID: $HID"
    add_rooms_for_hotel "$HID" "$pref"
  done
}

# Set SEED_TAJ_ROOMS=1 to add another 3 room types to existing Taj (6af43af7d9b201383e86ed7c)
if [ "${SEED_TAJ_ROOMS:-0}" = "1" ]; then
  echo "Adding rooms to existing Taj hotel ($TAJ_HOTEL_ID)..."
  add_rooms_for_hotel "$TAJ_HOTEL_ID" 9
fi

seed_city_five "Delhi" \
  "11|Delhi Grand Palace|hotel|true" \
  "12|Delhi Capital Inn|apartment|false" \
  "13|Delhi Ridge Residency|hotel|false" \
  "14|Delhi Metro Stay|apartment|false" \
  "15|Delhi Heritage House|hotel|true"

seed_city_five "Mumbai" \
  "21|Mumbai Sea View|hotel|true" \
  "22|Mumbai Harbor Stay|hotel|false" \
  "23|Mumbai Bandra Heights|apartment|false" \
  "24|Mumbai Marine Plaza|hotel|false" \
  "25|Mumbai Gateway Inn|hotel|true"

seed_city_five "Bangalore" \
  "31|Bangalore Tech Lodge|hotel|true" \
  "32|Bangalore Garden Hotel|apartment|false" \
  "33|Bangalore Silicon Suites|hotel|false" \
  "34|Bangalore Lake View|apartment|false" \
  "35|Bangalore CBD Regency|hotel|true"

echo "Done. Verify: curl -s $BASE/hotel/allCities"