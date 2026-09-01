import type { GridPosition } from "./Grid";

export interface SnakeOptions {
    headPosition: GridPosition;
    length?: number;
    direction?: number;
}

export class Snake {
    private length: number;
    private head: GridPosition;
    private direction: number;
    private queue: GridPosition[];
    private diff = [-1, 0, 1, 0, -1];

    constructor(option: SnakeOptions) {
        this.length = option.length ?? 1;
        this.head = option.headPosition;
        this.direction = option.direction ?? -1;
        if (!this.isValidDirection(this.direction))
            this.direction = -1;
        this.queue = [];
    }

    /*
        0
      3   1
        2

    -1 -> stopped
    0 -> up -> -1,0
    1 -> right -> 0,1
    2 -> down -> 1,0
    3 -> left -> 0,-1
    */
    private isValidDirection(dir: number): boolean {
        return !(dir < -1 || dir > 3);
    }

    setDirection(dir: number): void {
        if (!this.isValidDirection(dir))
            return;

        // stop snake
        if (dir === -1) {
            this.direction = dir;
            return;
        }

        // if snake not stopped
        if (this.direction !== -1) {
            const opposite = (this.direction + 2) % 4;
            if (dir === opposite)
                return;
        }

        this.direction = dir;
    }

    getHead(): GridPosition {
        return this.head;
    }

    getLength(): number {
        return this.length;
    }

    grow(amount: number): void {
        this.length += amount;
    }

    moveForward(): MoveResult {
        const res: MoveResult = {
            head: this.head,
            tail: null
        };

        if (this.direction == -1)
            return res;

        const newHead: GridPosition = {
            row: this.head.row + this.diff[this.direction],
            col: this.head.col + this.diff[this.direction + 1]
        };
        res.head = newHead;
        this.head = newHead;

        this.queue.push(newHead);

        if (this.queue.length > this.length) {
            res.tail = this.queue.shift()!;
        }

        return res;
    }
}

export interface MoveResult {
    head: GridPosition;
    tail: GridPosition | null;
};