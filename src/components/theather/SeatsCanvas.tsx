import { useEffect, useRef, useState } from "react"

const SeatsCanvas = () => {
  const myCanvas = useRef<HTMLCanvasElement>(null)
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set())
  const [bookedSeats] = useState<Set<string>>(new Set(['A3', 'A4', 'B5', 'C2', 'D7', 'E1', 'E8']))

  // Theater configuration
  const SEAT_SIZE = 20
  const SEAT_PADDING = 5
  const ROW_SPACING = 35
  const SECTION_PADDING = 40
  const AISLE_WIDTH = 30

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  const seatsPerRow = 10

  useEffect(() => {
    const canvas = myCanvas.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw theater screen
    drawScreen(ctx)
    
    // Draw seats
    drawSeats(ctx)
    
    // Draw labels
    drawLabels(ctx)
    
    // Add click event listener
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      const seatInfo = getSeatAtPosition(x, y)
      if (seatInfo && !bookedSeats.has(seatInfo)) {
        setSelectedSeats(prev => {
          const newSelected = new Set(prev)
          if (newSelected.has(seatInfo)) {
            newSelected.delete(seatInfo)
          } else {
            newSelected.add(seatInfo)
          }
          return newSelected
        })
      }
    }

    canvas.addEventListener('click', handleClick)
    
    return () => {
      canvas.removeEventListener('click', handleClick)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeats, bookedSeats])

  const drawScreen = (ctx: CanvasRenderingContext2D) => {
    // Draw screen
    ctx.fillStyle = '#2c3e50'
    ctx.fillRect(50, 20, 500, 15)
    
    // Screen label
    ctx.fillStyle = '#34495e'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('SCREEN', 300, 55)
  }

  const drawSeats = (ctx: CanvasRenderingContext2D) => {
    rows.forEach((row, rowIndex) => {
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        const seatId = `${row}${seatNum}`
        const x = getSeatX(seatNum - 1)
        const y = getSeatY(rowIndex)
        const radius = 4
        
        if (bookedSeats.has(seatId)) {
          // Booked seats - gray with no border
          ctx.fillStyle = '#9ca3af'
          drawRoundedRect(ctx, x, y, SEAT_SIZE, SEAT_SIZE, radius)
          ctx.fill()
          
          // Seat number for booked seats
          ctx.fillStyle = '#4b5563'
          ctx.font = '10px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(seatNum.toString(), x + SEAT_SIZE/2, y + SEAT_SIZE/2 + 3)
        } else if (selectedSeats.has(seatId)) {
          // Selected seats - dark green fill with green border
          ctx.fillStyle = '#16a34a'
          drawRoundedRect(ctx, x, y, SEAT_SIZE, SEAT_SIZE, radius)
          ctx.fill()
          
          ctx.strokeStyle = '#22c55e'
          ctx.lineWidth = 2
          drawRoundedRect(ctx, x, y, SEAT_SIZE, SEAT_SIZE, radius)
          ctx.stroke()
          
          // White seat number for selected seats
          ctx.fillStyle = '#ffffff'
          ctx.font = '10px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(seatNum.toString(), x + SEAT_SIZE/2, y + SEAT_SIZE/2 + 3)
        } else {
          // Available seats - white fill with green border
          ctx.fillStyle = '#ffffff'
          drawRoundedRect(ctx, x, y, SEAT_SIZE, SEAT_SIZE, radius)
          ctx.fill()
          
          ctx.strokeStyle = '#22c55e'
          ctx.lineWidth = 2
          drawRoundedRect(ctx, x, y, SEAT_SIZE, SEAT_SIZE, radius)
          ctx.stroke()
          
          // Dark seat number for available seats
          ctx.fillStyle = '#374151'
          ctx.font = '10px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(seatNum.toString(), x + SEAT_SIZE/2, y + SEAT_SIZE/2 + 3)
        }
      }
    })
  }

  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }

  const drawLabels = (ctx: CanvasRenderingContext2D) => {
    // Row labels
    ctx.fillStyle = '#2c3e50'
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    
    rows.forEach((row, rowIndex) => {
      const y = getSeatY(rowIndex)
      ctx.fillText(row, 25, y + SEAT_SIZE/2 + 5)
      ctx.fillText(row, 575, y + SEAT_SIZE/2 + 5)
    })
    
    // Legend
    drawLegend(ctx)
  }

  const drawLegend = (ctx: CanvasRenderingContext2D) => {
    const legendY = 350
    const legendItems = [
      { color: '#ffffff', borderColor: '#22c55e', text: 'Available' },
      { color: '#16a34a', borderColor: '#22c55e', text: 'Selected' },
      { color: '#9ca3af', borderColor: null, text: 'Booked' }
    ]
    
    ctx.font = '12px Arial'
    ctx.textAlign = 'left'
    
    legendItems.forEach((item, index) => {
      const x = 50 + (index * 120)
      const radius = 3
      
      // Draw color box with rounded corners
      ctx.fillStyle = item.color
      drawRoundedRect(ctx, x, legendY, 15, 15, radius)
      ctx.fill()
      
      // Draw border if specified
      if (item.borderColor) {
        ctx.strokeStyle = item.borderColor
        ctx.lineWidth = 2
        drawRoundedRect(ctx, x, legendY, 15, 15, radius)
        ctx.stroke()
      }
      
      // Draw text
      ctx.fillStyle = '#2c3e50'
      ctx.fillText(item.text, x + 20, legendY + 12)
    })
  }

  const getSeatX = (seatIndex: number) => {
    let x = SECTION_PADDING + (seatIndex * (SEAT_SIZE + SEAT_PADDING))
    
    // Add aisle space after seat 5
    if (seatIndex >= 5) {
      x += AISLE_WIDTH
    }
    
    return x
  }

  const getSeatY = (rowIndex: number) => {
    return 80 + (rowIndex * ROW_SPACING)
  }

  const getSeatAtPosition = (clickX: number, clickY: number) => {
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const rowY = getSeatY(rowIndex)
      
      if (clickY >= rowY && clickY <= rowY + SEAT_SIZE) {
        for (let seatIndex = 0; seatIndex < seatsPerRow; seatIndex++) {
          const seatX = getSeatX(seatIndex)
          
          if (clickX >= seatX && clickX <= seatX + SEAT_SIZE) {
            return `${rows[rowIndex]}${seatIndex + 1}`
          }
        }
      }
    }
    return null
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Theater Seating</h2>
      
      <div className="flex justify-center mb-4">
        <canvas 
          ref={myCanvas} 
          id="myCanvas" 
          width="800" 
          height="400" 
          className="border border-gray-300 bg-white rounded shadow-md cursor-pointer"
        />
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Click seats to select/deselect them</p>
        {selectedSeats.size > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">Selected Seats:</h3>
            <p className="text-blue-600 font-medium">
              {Array.from(selectedSeats).sort().join(', ')}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Total: {selectedSeats.size} seat{selectedSeats.size !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SeatsCanvas