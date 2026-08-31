import type { Grid } from "./Grid";

export interface GridRendererOptions {
    ctx: CanvasRenderingContext2D;
    gridStyle: GridStyle;
    palette: string[];
};

export class GridRenderer {
    private ctx;
    private palette;
    private gridStyle;

    constructor(options: GridRendererOptions) {
        this.ctx = options.ctx;
        this.palette = options.palette;
        this.gridStyle = options.gridStyle;
    }

    drawCell(x: number, y: number, val: number) {
        const ctx = this.ctx;
        const palette = this.palette;
        const { cellSize, borderColor, borderWidth } = this.gridStyle;

        ctx.fillStyle = borderColor;
        ctx.fillRect(x, y, cellSize, cellSize);

        ctx.fillStyle = val >= palette.length ? "white" : palette[val];
        ctx.fillRect(x + borderWidth, y + borderWidth, cellSize - 2 * borderWidth, cellSize - 2 * borderWidth);
    }

    drawGrid(grid: Grid) {
        const { cellSize } = this.gridStyle;
        for (let i = 0; i < grid.rows; i++) {
            for (let j = 0; j < grid.cols; j++) {
                const x = j * cellSize;
                const y = i * cellSize;

                const val = grid.getCell(i, j);
                this.drawCell(x, y, val)
            }
        }
    }
}

export type GridStyle = {
    cellSize: number
    borderColor: string;
    borderWidth: number;
};

/*

grid dimensions * cellSize => canvas dimensions

borders 
- draw large rect with border color (w,h = cellSize,cellSize)
- draw smaller rect with the actual cell color

*/