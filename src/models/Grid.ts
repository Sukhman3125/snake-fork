export class Grid {
    private buffer;
    public readonly rows;
    public readonly cols;

    constructor(row: number, col: number) {
        this.buffer = new Uint8Array(row * col);
        this.rows = row;
        this.cols = col;
    }

    getIndex(row: number, col: number): number {
        return row * this.cols + col;
    }

    getCell(row: number, col: number): number {
        const index = this.getIndex(row, col);

        if (index >= this.buffer.length)
            return -1;

        return this.buffer[index];
    }

    setCell(row: number, col: number, val: number): void {
        const index = this.getIndex(row, col);
        
        if (index >= this.buffer.length)
            return;

        this.buffer[row * this.cols + col] = val;
    }
};
