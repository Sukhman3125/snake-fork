import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Game } from './models/Game';
import type { GridStyle } from './models/GridRenderer';
import { Directions } from './models/Snake';


const rows = 20;
const cols = 40;

const cellSize = 30;
const width = cellSize * cols;
const height = cellSize * rows;

const gridStyle: GridStyle = {
  borderColor: "black",
  borderWidth: 1,
  cellSize,
};

// const classicPalette = ["blue", "yellow", "red", "green", "purple"];
const wormPalette = ["blue", "#e2b8b4", "#dc7f8e", "white", "purple"];

const difficulty = {
  easy: 5,
  medium: 10,
  hard: 15
};

function App() {
  const [ticks, setTicks] = useState(0);
  const [paused, setPaused] = useState(true);
  const [death, setDeath] = useState(false);
  const [length, setLength] = useState(1);
  const [highScore, setHighScore] = useState<number>(() => Number(localStorage.getItem("highScore")) || 0);
  const [speed, setSpeed] = useState(difficulty.hard);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);

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
      snakeDirection: Directions.right,
      ctx,
      palette: wormPalette,
      gridStyle,
      paused: true,
      ticksPerSec: difficulty.hard,
      setDeath,
      setPaused,
      setLength,
      setTicks
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

  const handleSpeed = (val: number) => {
    gameRef.current?.setSpeed(val);
    setSpeed(val);
  }

  return (
    <div className="bg-zinc-800 w-screen h-screen text-white flex flex-col font-mono">

      <div className="flex justify-center items-center gap-4 h-10 text-lg">
        <button
          className={`hover:underline ${speed === difficulty.easy ? "text-green-400" : "text-white"}`}
          onClick={() => handleSpeed(difficulty.easy)}
        >
          Easy
        </button>

        <button
          className={`hover:underline ${speed === difficulty.medium ? "text-red-400" : "text-white"}`}
          onClick={() => handleSpeed(difficulty.medium)}
        >
          Medium
        </button>

        <button
          className={`hover:underline ${speed === difficulty.hard ? "text-purple-400" : "text-white"}`}
          onClick={() => handleSpeed(difficulty.hard)}
        >
          Hard
        </button>
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          height={height}
          width={width}
        />
      </div>

      <div className="grid grid-cols-3 ml-5 mr-5 py-2 text-lg">
        <div className="text-left">
          Score: {length}
        </div>

        <div className="text-center">
          Time: {ticks}
        </div>

        <div className="text-right">
          High Score: {highScore}
        </div>
      </div>

      {paused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black w-40 h-20 flex items-center justify-center text-xl">
            PAUSED
          </div>
        </div>
      )}

      {death && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black w-40 h-20 flex items-center justify-center text-red-500 text-2xl">
            YOU DIED
          </div>
        </div>
      )}

      <a
        className="m-auto hover:underline hover:text-blue-300"
        href="https://github.com/mars985/snake"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>

    </div>
  );
}

export default App;