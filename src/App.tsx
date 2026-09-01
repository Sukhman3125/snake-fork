import { useEffect, useRef } from 'react';
import './App.css'
import { Grid } from './models/Grid';
import { GridRenderer, type GridStyle } from './models/GridRenderer';

function App() {
  const rows = 12;
  const cols = 18;
  const grid = new Grid({rows, cols});
  
  const cellSize = 40;
  const width = cellSize * cols;
  const height = cellSize * rows;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridStyle: GridStyle = {
    borderColor: "black",
    borderWidth: 2,
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
