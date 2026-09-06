import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Game } from './models/Game';
import type { GridStyle } from './models/GridRenderer';

function App() {
  const [paused, setPaused] = useState(true);
  const [death, setDeath] = useState(false);
  const [length, setLength] = useState(1);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem("highScore")) || 0;
  });
  
  const rows = 20;
  const cols = 40;

  const cellSize = 30;
  const width = cellSize * cols;
  const height = cellSize * rows;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);

  const gridStyle: GridStyle = {
    borderColor: "black",
    borderWidth: 1,
    cellSize,
  };

  const classicPalette = ["blue", "yellow", "red", "green", "purple"];
  const wormPalette = ["blue", "#e2b8b4", "#dc7f8e", "white", "purple"];

  const difficulty = {
    easy: 2,
    medium: 5,
    hard: 10
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    gameRef.current = new Game({
      rows,
      cols,
      snakeHead: { row: 3, col: 3 },
      snakeLength: length,
      ctx,
      palette: wormPalette,
      gridStyle,
      paused: true,
      ticksPerSec: difficulty.medium,
      setDeath,
      setPaused,
      setLength
    });

    return () => {
      gameRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (length > highScore) {
      setHighScore(length);
      localStorage.setItem("highScore", length.toString());
    }
  }, [length, highScore]);

  return (
    <div className="bg-zinc-800 w-screen h-screen text-white flex flex-col font-mono">

      <div className="flex justify-center items-center gap-4 h-10 text-lg">
        <button onClick={() => { gameRef.current?.setSpeed(difficulty.easy) }}>Easy</button>
        <button onClick={() => { gameRef.current?.setSpeed(difficulty.medium) }}>Medium</button>
        <button onClick={() => { gameRef.current?.setSpeed(difficulty.hard) }}>Hard</button>
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          height={height}
          width={width}
        />
      </div>

      <div className="flex justify-between ml-5 mr-5 gap-8 py-2 text-lg">
        <div>
          Score: <span>{length}</span>
        </div>

        <div>
          High Score: <span>{highScore}</span>
        </div>
      </div>

      {paused && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black w-40 h-20 flex items-center justify-center text-xl">
            PAUSED
          </div>
        </div>
      )}

      {death && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black w-40 h-20 flex items-center justify-center text-red-500 text-2xl">
            YOU DIED
          </div>
        </div>
      )}
    </div>
  );
}

export default App;