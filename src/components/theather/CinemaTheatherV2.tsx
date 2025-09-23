import React, { useState } from "react";
import "./SeatBooking.css";

const rows = 6;
const seatsPerRow = 10;
const miniSeatSize = 15; // px
const miniSeatGap = 4;   // px
const lineOffset = 10;   // distance from seat to line in px

type SeatId = `${number}-${number}`;

type HoveredSeat = {
  row: number;
  seat: number;
} | null;

export default function SeatBooking() {
  const [selectedSeats, setSelectedSeats] = useState<SeatId[]>([]);
  const [hoveredSeat, setHoveredSeat] = useState<HoveredSeat>(null);

  const toggleSeat = (row: number, seat: number) => {
    const id: SeatId = `${row}-${seat}`;
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== id));
    } else {
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  const getMiniSeatPosition = (row: number, seat: number) => {
    const top = row * (miniSeatSize + miniSeatGap);
    const left = seat * (miniSeatSize + miniSeatGap);
    return { top, left };
  };

  return (
    <div className="container">
      <div className="screen">SCREEN</div>
      <div className="seats-container">
        {Array.from({ length: rows }).map((_, r) => {
          const isHoveredRow = hoveredSeat?.row === r;

          // Calculate position of hovered seat in mini-map
          let hoveredSeatTop = 0;
          if (hoveredSeat && isHoveredRow) {
            // Calculate the center position of the hovered seat based on its row position in the mini-map
            hoveredSeatTop = hoveredSeat.row * (miniSeatSize + miniSeatGap) + miniSeatSize / 2;
          }

          return (
            <div key={r} className="row">
              <div className={`preview-card ${isHoveredRow ? "show" : ""}`} style={{ position: 'relative' }}>
                <div className="seat-map" style={{ position: 'relative' }}>
                  {Array.from({ length: rows * seatsPerRow }).map((_, index) => {
                    const seatRow = Math.floor(index / seatsPerRow);
                    const seatCol = index % seatsPerRow;
                    const isHighlighted =
                      hoveredSeat &&
                      hoveredSeat.row === seatRow &&
                      hoveredSeat.seat === seatCol;
                    const position = getMiniSeatPosition(seatRow, seatCol);
                    
                    return (
                      <div
                        key={index}
                        className={`mini-seat ${isHighlighted ? "selected" : ""}`}
                        style={{
                          position: 'absolute',
                          top: `${position.top}px`,
                          left: `${position.left}px`,
                          width: `${miniSeatSize}px`,
                          height: `${miniSeatSize}px`
                        }}
                      ></div>
                    );
                  })}

                  {/* Red lines above and below hovered seat - inside seat-map */}
                  {hoveredSeat && isHoveredRow && (
                    <>
                      <div
                        className="zoom-line top"
                        style={{ 
                          top: `${hoveredSeatTop - lineOffset}px`,
                          position: 'absolute',
                          left: '0',
                          right: '0',
                          height: '2px',
                          backgroundColor: 'red',
                          width: '100%',
                          zIndex: 10
                        }}
                      ></div>
                      <div
                        className="zoom-line bottom"
                        style={{ 
                          top: `${hoveredSeatTop + lineOffset}px`,
                          position: 'absolute',
                          left: '0',
                          right: '0',
                          height: '2px',
                          backgroundColor: 'red',
                          width: '100%',
                          zIndex: 10
                        }}
                      ></div>
                    </>
                  )}
                </div>
              </div>

              {Array.from({ length: seatsPerRow }).map((_, s) => {
                const id: SeatId = `${r}-${s}`;
                return (
                  <div
                    key={s}
                    className={`seat ${selectedSeats.includes(id) ? "selected" : ""}`}
                    onClick={() => toggleSeat(r, s)}
                    onMouseEnter={() => setHoveredSeat({ row: r, seat: s })}
                    onMouseLeave={() => setHoveredSeat(null)}
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}