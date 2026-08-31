import { useEffect, useRef } from 'react';
import './App.css'
import { Grid } from './models/Grid';
import { GridRenderer, type GridStyle } from './models/GridRenderer';

function App() {
  const rows = 5;
  const cols = 5;
  const cellSize = 50;

  const grid = new Grid(rows, cols);
  const width = cellSize * rows;
  const height = cellSize * cols;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridStyle: GridStyle = {
    borderColor: "black",
    borderWidth: 5,
    cellSize: cellSize
  }
  const palette: string[] = ["red", "blue"];

  let renderer;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderer = new GridRenderer({ ctx, gridStyle, palette });
    renderer.drawGrid(grid);
  }, []);

  return (
    <div>
      <div>
        Hello World
      </div>
      <canvas ref={canvasRef} height={height} width={width} />
    </div>
  );
}

export default App
