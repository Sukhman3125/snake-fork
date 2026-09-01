export interface GridOptions {
    rows: number;
    cols: number;
}

export class Grid {
    private buffer;
    public readonly rows;
    public readonly cols;

    constructor(options: GridOptions) {
        this.rows = options.rows;
        this.cols = options.cols;
        this.buffer = new Uint8Array(this.rows * this.cols);
    }

    private getIndex(row: number, col: number): number {
        return row * this.cols + col;
    }

    getCell(row: number, col: number): number {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols)
            return -1;

        const index = this.getIndex(row, col);
        return this.buffer[index];
    }

    setCell(row: number, col: number, val: number): void {
        const index = this.getIndex(row, col);

        if (index >= this.buffer.length)
            return;

        this.buffer[row * this.cols + col] = val;
    }
};

export interface GridPosition {
    row: number;
    col: number;
};