import React, { useState, useRef, useEffect, useCallback } from 'react';
import './SeatBooking.css';
import TheaterCanvas from './TheatherCanvas';

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'sold' | 'selected';
  price: number;
  section: 'prime' | 'classic-plus' | 'classic';
  y: number;
  x?: number;
  displayY?: number;
}

interface SeatStyle {
  fill: string;
  stroke: string;
  textColor: string;
}

interface PanOffset {
  x: number;
  y: number;
}

interface DragStart {
  x: number;
  y: number;
}

const TheaterSeatBooking: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  
  const [panOffset, setPanOffset] = useState<PanOffset>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<DragStart>({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(1);
  const [isDragSelecting, setIsDragSelecting] = useState<boolean>(false);
  const [dragSelectInitialState, setDragSelectInitialState] = useState<'select' | 'deselect' | null>(null);
  
  const SEAT_SIZE = 28;
  const SEAT_SPACING = 32;
  const ROW_SPACING = 38;
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 600;
  const THEATER_HEIGHT = 800;

  const generateSeats = (): Seat[] => {
    // ... (same as before) ...
    const seats: Seat[] = [];
    const primeRowsConfig = {
      'N': { seats: [1,2,4,5,6,7,9,10,11,12,13,14,15], soldSeats: [3,8], y: 80 },
      'M': { seats: [1,2,3,4,5,6,7,8,9,10,11,12], soldSeats: [], y: 118 },
      'L': { seats: [1,2,11,12,13,14], soldSeats: [3,4,5,6,7,8,9,10], y: 156 },
      'K': { seats: [1,2,3,4,5,6,7,8,9,10,11,12,13,14], soldSeats: [], y: 194 },
      'J': { seats: [1,2,3,4,5,6,7,8,9,10,11,12,13,14], soldSeats: [], y: 232 },
      'H': { seats: [1,2,3,4,5,6,7,8,9,10,11,12,13,14], soldSeats: [], y: 270 },
      'G': { seats: [1,2,3,4,5,6,7,8,9,10], soldSeats: [], y: 308 }
    };
    Object.entries(primeRowsConfig).forEach(([row, config]) => {
      config.seats.forEach(seatNum => {
        seats.push({
          id: `${row}${seatNum.toString().padStart(2, '0')}`,
          row,
          number: seatNum,
          status: config.soldSeats.includes(seatNum) ? 'sold' : 'available',
          price: 260,
          section: 'prime',
          y: config.y
        });
      });
    });
    const classicPlusConfig = {
      'F': { seats: [1,2,3,4,5,6,7,8,9,10,11,12,13], soldSeats: [], y: 380 },
      'E': { seats: [1,2,3,4,5,6,7,8,9,10,11,12,13], soldSeats: [], y: 418 },
      'D': { seats: [1,2,3,4,5,6,7,8,9,10,11,12,13], soldSeats: [6,7], y: 456 },
      'C': { seats: [1,2,3,4,5,6,7,8,9,10,11,12,13], soldSeats: [], y: 494 }
    };
    Object.entries(classicPlusConfig).forEach(([row, config]) => {
      config.seats.forEach(seatNum => {
        seats.push({
          id: `${row}${seatNum.toString().padStart(2, '0')}`,
          row,
          number: seatNum,
          status: config.soldSeats.includes(seatNum) ? 'sold' : 'available',
          price: 220,
          section: 'classic-plus',
          y: config.y
        });
      });
    });
    const classicConfig = {
      'B': { seats: [1,2,3,4,9,10,11,12,13], soldSeats: [5,6,7,8], y: 566 },
      'A': { seats: [4,5,6,7,8,9,10,11,12,13], soldSeats: [1,2,3], y: 604 }
    };
    Object.entries(classicConfig).forEach(([row, config]) => {
      config.seats.forEach(seatNum => {
        seats.push({
          id: `${row}${seatNum.toString().padStart(2, '0')}`,
          row,
          number: seatNum,
          status: config.soldSeats.includes(seatNum) ? 'sold' : 'available',
          price: 200,
          section: 'classic',
          y: config.y
        });
      });
    });
    return seats;
  };

  const [seats] = useState<Seat[]>(generateSeats);

  const getSeatXPosition = (seat: Seat): number => {
    const baseX = 300;
    const { row, number } = seat;
    switch (row) {
      case 'N':
        if (number <= 2) return baseX + (number - 1) * SEAT_SPACING;
        if (number <= 7) return baseX + (number - 1) * SEAT_SPACING + 20;
        if (number <= 10) return baseX + (number - 1) * SEAT_SPACING + 50;
        return baseX + (number - 1) * SEAT_SPACING + 80;
      case 'M':
        if (number <= 10) return baseX + (number - 1) * SEAT_SPACING;
        return baseX + (number - 1) * SEAT_SPACING + 100;
      case 'L':
        if (number <= 2) return baseX + (number - 1) * SEAT_SPACING;
        return baseX + (number - 9) * SEAT_SPACING + 320;
      case 'K':
      case 'J': 
      case 'H':
        if (number <= 10) return baseX + (number - 1) * SEAT_SPACING;
        return baseX + (number - 1) * SEAT_SPACING + 100;
      case 'G':
        return baseX + (number - 1) * SEAT_SPACING;
      case 'F':
      case 'E':
      case 'D':
      case 'C':
        return baseX + (number - 1) * SEAT_SPACING;
      case 'B':
        if (number <= 4) return baseX + (number - 1) * SEAT_SPACING;
        return baseX + (number - 1) * SEAT_SPACING + 60;
      case 'A':
        return baseX + (number - 1) * SEAT_SPACING + 20;
      default:
        return baseX + (number - 1) * SEAT_SPACING;
    }
  };

  const getSeatStyle = (seat: Seat): SeatStyle => {
    if (seat.status === 'sold') {
      return { fill: '#e0e0e0', stroke: '#ccc', textColor: '#aaa' };
    }
    if (selectedSeats.has(seat.id)) {
      return { fill: '#4caf50', stroke: '#388e3c', textColor: '#fff' };
    }
    if (hoveredSeat === seat.id) {
      return { fill: '#81c784', stroke: '#4caf50', textColor: '#fff' };
    }
    return { fill: '#ffffff', stroke: '#888', textColor: '#333' };
  };

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    radius: number
  ): void => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const drawTheater = useCallback((
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    isPreview: boolean = false
  ): void => {
    const seatScale = isPreview ? 1 : 1; // ← Increased from 0.28 to 0.65 for visibility
    const fontScale = isPreview ? .6 : 1; // ← Hide text in preview
    const currentScale = isPreview ? 1 : scale;
    const currentPanX = isPreview ? 0.3 : panOffset.x;
    const currentPanY = isPreview ? 0.3 : panOffset.y;
    
    ctx.fillStyle = isPreview ? '#1e1e1e' : '#f5f5f5'; // Dark bg for preview canvas
    ctx.fillRect(0, 0, width, height);
    
    ctx.save();
    // if (!isPreview) {
      ctx.scale(currentScale, currentScale);
      ctx.translate(currentPanX / currentScale, currentPanY / currentScale);
    // }
    
    // Section headers (only in main view)
    // if (!isPreview) {
      ctx.fillStyle = '#555';
      ctx.font = `bold ${16 * fontScale}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('₹260 PRIME ROWS', CANVAS_WIDTH / 2, 50);
      ctx.fillText('₹220 CLASSIC PLUS ROWS', CANVAS_WIDTH / 2, 360);
      ctx.fillText('₹200 CLASSIC ROWS', CANVAS_WIDTH / 2, 548);
    // }
    
    const rowsDrawn = new Set<string>();
    seats.forEach(seat => {
      const x = getSeatXPosition(seat);
      const y = seat.y;
      
    //   if (!isPreview) {
        seat.x = x;
        seat.displayY = y;
    //   }
      
      if (!rowsDrawn.has(seat.row) ) {
        ctx.fillStyle = '#222';
        ctx.font = `bold ${18 * fontScale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(seat.row, 60, y + (SEAT_SIZE * seatScale) / 2 + 6);
        rowsDrawn.add(seat.row);
      }
      
      const style = getSeatStyle(seat);
      ctx.fillStyle = style.fill;
      ctx.strokeStyle = isPreview ? 'transparent' : style.stroke;
      ctx.lineWidth = isPreview ? 1 : 1.5;
      
      const size = SEAT_SIZE * seatScale;
  
        drawRoundedRect(ctx, x, y, size, size, 4);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = style.textColor;
        ctx.font = `bold ${11}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(seat.number.toString().padStart(2, '0'), x + size / 2, y + size / 2 + 4);
    //   }
    });
    
    // Screen (only in main view)
    // if (!isPreview) {
      const screenY = THEATER_HEIGHT - 60;
      const screenWidth = 400;
      const screenHeight = 25;
      const screenX = CANVAS_WIDTH / 2 - screenWidth / 2;
      const grad = ctx.createLinearGradient(screenX, screenY, screenX, screenY + screenHeight);
      grad.addColorStop(0, '#e3f2fd');
      grad.addColorStop(1, '#bbdefb');
      ctx.fillStyle = grad;
      drawRoundedRect(ctx, screenX, screenY, screenWidth, screenHeight, 8);
      ctx.fill();
      ctx.strokeStyle = '#90caf9';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    // }
    
    ctx.restore();

    // === HIGH-CONTRAST MINI-MAP (only while dragging) ===
    if (!isPreview && isDragging) {
      const PREVIEW_HEIGHT = 180;
      const PREVIEW_WIDTH = (PREVIEW_HEIGHT / THEATER_HEIGHT) * CANVAS_WIDTH;

      const margin = 16;
      const previewX = width - PREVIEW_WIDTH - margin;
      const previewY = height - PREVIEW_HEIGHT - margin;

      // Background for visibility
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.strokeStyle = '#4fc3f7';
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, previewX - 3, previewY - 3, PREVIEW_WIDTH + 6, PREVIEW_HEIGHT + 6, 8);
      ctx.fill();
      ctx.stroke();

      // Draw preview content
      ctx.save();
      ctx.beginPath();
      ctx.rect(previewX, previewY, PREVIEW_WIDTH, PREVIEW_HEIGHT);
      ctx.clip();

      ctx.translate(previewX, previewY);
      const scaleX = PREVIEW_WIDTH / CANVAS_WIDTH;
      const scaleY = PREVIEW_HEIGHT / THEATER_HEIGHT;
      ctx.scale(scaleX, scaleY);

      // Draw full theater in preview mode (with larger seats, no text)
      drawTheater(ctx, CANVAS_WIDTH, THEATER_HEIGHT, true);

      ctx.restore(); // exit clip & transform

      // Viewport indicator
      const vx = (-panOffset.x / scale) * scaleX;
      const vy = (-panOffset.y / scale) * scaleY;
      const vw = (CANVAS_WIDTH / scale) * scaleX;
      const vh = (CANVAS_HEIGHT / scale) * scaleY;

      ctx.strokeStyle = '#ff5722';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(previewX + vx, previewY + vy, vw, vh);
      ctx.setLineDash([]);

      ctx.restore(); // exit background
    }
  }, [seats, selectedSeats, hoveredSeat, scale, panOffset, isDragging]);

  const drawMainCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.width = `${CANVAS_WIDTH}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;
    ctx.scale(dpr, dpr);
    drawTheater(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, false);
  }, [drawTheater]);

  const getSeatAtPosition = (clientX: number, clientY: number): Seat | undefined => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) - panOffset.x) / scale;
    const y = ((clientY - rect.top) - panOffset.y) / scale;
    return seats.find(seat => 
      seat.x !== undefined && seat.displayY !== undefined &&
      x >= seat.x && x <= seat.x + SEAT_SIZE &&
      y >= seat.displayY && y <= seat.displayY + SEAT_SIZE
    );
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      const seat = getSeatAtPosition(e.clientX, e.clientY);
      if (seat && seat.status !== 'sold') {
        setIsDragSelecting(true);
        setDragSelectInitialState(selectedSeats.has(seat.id) ? 'deselect' : 'select');
        // setSelectedSeats(prev => {
        //   const s = new Set(prev);
        //   s.has(seat.id) ? s.delete(seat.id) : s.add(seat.id);
        //   return s;
        // });
        setHoveredSeat(null);
      } else {
        setIsDragging(true);
        setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      }
      if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragSelecting) {
      const seat = getSeatAtPosition(e.clientX, e.clientY);
      if (seat && seat.status !== 'sold') {
        setSelectedSeats(prev => {
          const s = new Set(prev);
          if (dragSelectInitialState === 'select') s.add(seat.id);
          else if (dragSelectInitialState === 'deselect') s.delete(seat.id);
          return s;
        });
      }
    } else if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      const maxPanX = 0;
      const minPanX = -(CANVAS_WIDTH * scale - CANVAS_WIDTH);
      const maxPanY = 0;
      const minPanY = -(THEATER_HEIGHT * scale - CANVAS_HEIGHT);
      setPanOffset({
        x: Math.max(minPanX, Math.min(maxPanX, newX)),
        y: Math.max(minPanY, Math.min(maxPanY, newY))
      });
    } else {
      const seat = getSeatAtPosition(e.clientX, e.clientY);
      if (seat && seat.status !== 'sold') {
        if (canvasRef.current) canvasRef.current.style.cursor = 'pointer';
        setHoveredSeat(seat.id);
      } else {
        if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        setHoveredSeat(null);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDragSelecting(false);
    setDragSelectInitialState(null);
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const worldX = (mouseX - panOffset.x) / scale;
    const worldY = (mouseY - panOffset.y) / scale;
    const zoomFactor = 0.1;
    const newScale = e.deltaY > 0 
      ? Math.max(0.7, scale - zoomFactor) 
      : Math.min(2, scale + zoomFactor);
    const newPanX = mouseX - worldX * newScale;
    const newPanY = mouseY - worldY * newScale;
    setScale(newScale);
    setPanOffset({ x: newPanX, y: newPanY });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging && !isDragSelecting) {
      const seat = getSeatAtPosition(e.clientX, e.clientY);
      if (seat && seat.status !== 'sold') {
        setSelectedSeats(prev => {
          const s = new Set(prev);
          s.has(seat.id) ? s.delete(seat.id) : s.add(seat.id);
          return s;
        });
      }
    }
  };

  const resetView = () => {
    setPanOffset({ x: 0, y: 0 });
    setScale(1);
  };

  useEffect(() => { 
    drawMainCanvas(); 
  }, [drawMainCanvas]);

  return (
    <div className="theater-container">
      <div className="theater-controls">
        <button onClick={resetView}>Reset View</button>
        <span className="scale-info">Zoom: {Math.round(scale * 100)}%</span>
      </div>

      <div className="theater-canvas-container">
        <TheaterCanvas
          ref={canvasRef}
          handleCanvasClick={handleCanvasClick}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          handleWheel={handleWheel}
        />
      </div>
    </div>
  );
};

export default TheaterSeatBooking;