import React, { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

// Define props interface
interface TheaterCanvasProps extends HTMLAttributes<HTMLCanvasElement> {
  handleCanvasClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void;
}

const TheaterCanvas = forwardRef<HTMLCanvasElement, TheaterCanvasProps>((props, ref) => {
  const {
    handleCanvasClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    ...rest // in case you want to allow other canvas props
  } = props;

  return (
    <canvas
      ref={ref}
      onClick={handleCanvasClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className="theater-canvas"
      {...rest}
    />
  );
});

export default TheaterCanvas;