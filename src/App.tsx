import { useEffect, useRef } from 'react';
import './App.css';
import { Game } from './models/Game';
import type { GridStyle } from './models/GridRenderer';

function App() {
  const rows = 12;
  const cols = 36;

  const cellSize = 40;
  const width = cellSize * cols;
  const height = cellSize * rows;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);

  const gridStyle: GridStyle = {
    borderColor: "black",
    borderWidth: 2,
    cellSize,
  };

  const palette = ["blue", "yellow", "red", "green", "purple"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    gameRef.current = new Game({
      rows,
      cols,
      snakeHead: { row: 3, col: 3 },
      ctx,
      palette,
      gridStyle,
      paused: true,
      ticksPerSec: 2,
    });

    return () => {
      gameRef.current?.pause();
    };
  }, []);

  return (
    <div>
      <div>Hello World</div>

      <button onClick={() => gameRef.current?.play()}>
        Play
      </button>

      <button onClick={() => gameRef.current?.pause()}>
        Pause
      </button>

      <button onClick={() => gameRef.current?.togglePause()}>
        Toggle
      </button>

      <button onClick={() => gameRef.current?.setSpeed(2)}>
        2 TPS
      </button>

      <button onClick={() => gameRef.current?.setSpeed(5)}>
        5 TPS
      </button>

      <canvas
        ref={canvasRef}
        height={height}
        width={width}
      />
    </div>
  );
}

export default App;