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

    private getIndex(position: GridPosition): number {
        return position.row * this.cols + position.col;
    }

    getCell(position: GridPosition): number {
        if (position.row < 0 || position.row >= this.rows || position.col < 0 || position.col >= this.cols)
            return -1;

        const index = this.getIndex(position);
        return this.buffer[index];
    }

    setCell(position: GridPosition, val: number): void {
        const index = this.getIndex(position);

        if (index >= this.buffer.length)
            return;

        this.buffer[position.row * this.cols + position.col] = val;
    }

    getCount(value: number): number {
        return this.buffer.reduce((count, val) => val == value ? count + 1 : count, 0);
    }
};

export interface GridPosition {
    row: number;
    col: number;
};