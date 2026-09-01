import { useEffect, useRef } from 'react';
import './App.css'
import { Grid } from './models/Grid';
import { GridRenderer, type GridStyle } from './models/GridRenderer';
import { Board } from './models/Board';

function App() {
  const rows = 12;
  const cols = 36;

  const boardRef = useRef(new Board({ rows, cols, snakeHead: { row: 3, col: 3 } }));
  const board = boardRef.current;
  board.addFruit({row: 4, col:14});
  board.addFruit({row: 9, col:27});

  const cellSize = 40;
  const width = cellSize * cols;
  const height = cellSize * rows;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridStyle: GridStyle = {
    borderColor: "black",
    borderWidth: 2,
    cellSize: cellSize
  }
  const palette: string[] = ["blue", "yellow", "red", "green", "purple"];

  let renderer: GridRenderer;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderer = new GridRenderer({ ctx, gridStyle, palette });
    update();
  }, []);

  const update = () => {
    board.tick();
    renderer.drawGrid(board.grid);
  }

  return (
    <div>
      <div>
        Hello World
      </div>
      <button onClick={() => board.snake.setDirection(0)}>Up</button>
      <button onClick={() => board.snake.setDirection(1)}>Right</button>
      <button onClick={() => board.snake.setDirection(2)}>Down</button>
      <button onClick={() => board.snake.setDirection(3)}>Left</button>
      <button onClick={update}>Tick</button>
      <canvas ref={canvasRef} height={height} width={width} />
    </div>
  );
}

export default App
