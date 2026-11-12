import "./flightSeatMap.css";

const EXIT_ROWS = new Set([3, 8]);

const SeatButton = ({ seat, isSelected, onToggle }) => {
  if (seat.status === "none") {
    return <span className="flightSeatSpacer" aria-hidden />;
  }

  const isBooked = seat.status === "booked";

  return (
    <button
      type="button"
      className={[
        "flightSeat",
        isBooked ? "flightSeat--booked" : "flightSeat--free",
        isSelected ? "flightSeat--selected" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={isBooked}
      onClick={() => onToggle(seat.id)}
      title={isBooked ? `Seat ${seat.id} — taken` : `Seat ${seat.id}`}
      aria-label={`Seat ${seat.id}${isBooked ? ", already booked" : isSelected ? ", selected" : ", available"}`}
      aria-pressed={isSelected}
    >
      <span className="flightSeatBack" aria-hidden />
      <span className="flightSeatCushion" aria-hidden />
      <span className="flightSeatLabel">{seat.label}</span>
    </button>
  );
};

const FlightSeatMap = ({ seatMap, selectedSeats, onToggle }) => {
  if (!seatMap?.rows?.length) {
    return <p className="flightSeatMapEmpty">Seat map is not available for this flight.</p>;
  }

  const selected = new Set(selectedSeats || []);

  return (
    <div className="flightSeatPicker">
      <div className="flightSeatPickerSummary">
        <span>
          <strong>{seatMap.seatsAvailable}</strong> of {seatMap.totalSeats} seats open
        </span>
        {selectedSeats?.length > 0 && (
          <span className="flightSeatPickerPicked">
            Your seats: <strong>{selectedSeats.join(", ")}</strong>
          </span>
        )}
      </div>

      <div className="flightSeatPickerLegend">
        <span>
          <i className="legendDot legendDot--free" /> Available
        </span>
        <span>
          <i className="legendDot legendDot--picked" /> Selected
        </span>
        <span>
          <i className="legendDot legendDot--booked" /> Booked
        </span>
      </div>

      <div className="aircraftShell" role="group" aria-label="Aircraft seat map, economy cabin">
        <div className="aircraftNose">
          <span className="aircraftNoseMark" aria-hidden />
          <span className="aircraftNoseText">Front of aircraft</span>
        </div>

        <div className="aircraftCabinLabel">Economy · 3–3 layout</div>

        <div className="aircraftColumnHead">
          <span className="aircraftRowIndex" />
          <div className="aircraftCols aircraftCols--left">
            {["A", "B", "C"].map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
          <span className="aircraftAisleHead" />
          <div className="aircraftCols aircraftCols--right">
            {["D", "E", "F"].map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
          <span className="aircraftRowIndex" />
        </div>

        <div className="aircraftRowList">
          {seatMap.rows.map((row) => (
            <div key={row.row} className="aircraftRowBlock">
              {EXIT_ROWS.has(row.row) && (
                <div className="aircraftExitStrip">
                  <span>EXIT</span>
                  <span>EXIT</span>
                </div>
              )}
              <div
                className={`aircraftRow ${row.row >= 4 && row.row <= 6 ? "aircraftRow--wing" : ""}`}
              >
                <span className="aircraftRowIndex">{row.row}</span>
                <div className="aircraftCols aircraftCols--left">
                  {row.left.map((seat) => (
                    <SeatButton
                      key={seat.id}
                      seat={seat}
                      isSelected={selected.has(seat.id)}
                      onToggle={onToggle}
                    />
                  ))}
                </div>
                <span className="aircraftAisle" aria-hidden />
                <div className="aircraftCols aircraftCols--right">
                  {row.right.map((seat) => (
                    <SeatButton
                      key={seat.id}
                      seat={seat}
                      isSelected={selected.has(seat.id)}
                      onToggle={onToggle}
                    />
                  ))}
                </div>
                <span className="aircraftRowIndex">{row.row}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="aircraftTail">
          <span>Lavatories</span>
          <span className="aircraftTailGalley">Galley</span>
        </div>
      </div>

      <p className="flightSeatMapHint">
        {selectedSeats?.length
          ? "Tap another available seat to add it, or tap a selected seat to deselect."
          : "Only grey seats are taken — tap any green seat to select it."}
      </p>
    </div>
  );
};

export default FlightSeatMap;
