import { Grid, type GridOptions, type GridPosition } from "./Grid";
import { Snake, type Direction, type SnakeOptions } from "./Snake";

export interface BoardOptions extends GridOptions, SnakeOptions {
    growIncrement?: number;
};

const BoardStates = {
    empty: 0,
    snakeBody: 1,
    snakeHead: 2,
    fruit: 3,
    wall: 4,
}

export type BoardState = typeof BoardStates[keyof typeof BoardStates];

export class Board {
    private rows;
    private cols;
    public readonly grid;

    private snake;
    private growIncrement;
    private canTurn; // once per tick

    private emptyCells: GridPosition[];
    private mp: Map<GridPosition, number>;

    constructor(options: BoardOptions) {
        this.rows = options.rows;
        this.cols = options.cols;
        this.grid = new Grid({ rows: this.rows, cols: this.cols });

        this.snake = new Snake({ snakeHead: options.snakeHead, snakeLength: 5 });
        this.growIncrement = options.growIncrement ?? 5;
        this.canTurn = true;
        this.grid.setCell(options.snakeHead, BoardStates.snakeHead);

        this.emptyCells = [];
        this.mp = new Map();
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const pos: GridPosition = { row, col };
                if (this.grid.getCell(pos) === BoardStates.empty) {
                    this.emptyCells.push(pos);
                    this.mp.set(pos, this.emptyCells.length - 1);
                }
            }
        }

        this.addFruit();
        this.addFruit();
    }

    addFruit(): void;
    addFruit(position: GridPosition): void;

    addFruit(position?: GridPosition): void {
        if (position) {
            if (this.grid.getCell(position) !== 0)
                return;

            this.grid.setCell(position, BoardStates.fruit);
        } else {
            if (this.emptyCells.length === 0)
                return;

            const lastIndex = this.emptyCells.length - 1;
            const randomIndex = Math.floor(Math.random() * this.emptyCells.length);

            const randomPosition = this.emptyCells[randomIndex];
            const lastPosition = this.emptyCells[lastIndex];

            this.emptyCells[randomIndex] = lastPosition;
            this.emptyCells.pop();

            this.mp.delete(randomPosition);

            if (randomIndex !== lastIndex) {
                this.mp.set(lastPosition, randomIndex);
            }

            this.grid.setCell(randomPosition, BoardStates.fruit);
        }
    }

    setSnakeDirection(dir: number) {
        if (!this.canTurn)
            return;

        const directionChanged: boolean = this.snake.setDirection(dir);
        if (directionChanged) {
            this.canTurn = false;
        }
    }

    update(): BoardEvent {
        this.canTurn = true;
        const currHead = this.snake.getHead();
        const nextHead = this.snake.getNextHead();
        const cellValue = this.grid.getCell(nextHead);

        let res: BoardEvent;

        if (!(currHead.row === nextHead.row && currHead.col === nextHead.col)) {
            if (cellValue === BoardStates.snakeBody) {
                res = { type: "collision", with: "self" }
            } else if (cellValue === BoardStates.wall || cellValue === -1) {
                res = { type: "collision", with: "wall" }
            } else if (cellValue === BoardStates.fruit) {
                res = { type: "fruit-eaten" }
                this.snake.grow(this.growIncrement);
            }
            else {
                res = { type: "snake-moved" };
            }
        } else {
            res = { type: "snake-stopped" };
            return res;
        }

        this.grid.setCell(currHead, BoardStates.snakeBody);

        const { head, tail } = this.snake.moveForward();
        this.grid.setCell(head, BoardStates.snakeHead);

        if (tail) {
            this.grid.setCell(tail, BoardStates.empty);
            this.emptyCells.push(tail);
        }

        return res;
    }
}

export type BoardEvent =
    | { type: "snake-stopped" }
    | { type: "snake-moved" }
    | { type: "fruit-eaten" }
    | { type: "collision", with: "wall" | "self" };