import { Grid, type GridOptions, type GridPosition } from "./Grid";
import { Snake, type SnakeOptions } from "./Snake";

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

    public readonly snake;
    private growIncrement;

    private emptyCells: GridPosition[];
    private mp: Map<GridPosition, number>;

    constructor(options: BoardOptions) {
        this.rows = options.rows;
        this.cols = options.cols;
        this.grid = new Grid({ rows: this.rows, cols: this.cols });

        this.snake = new Snake({ snakeHead: options.snakeHead, snakeLength: 5 });
        this.growIncrement = options.growIncrement ?? 5;
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

    tick() {
        const currHead = this.snake.getHead();
        const nextHead = this.snake.getNextHead();
        const cellValue = this.grid.getCell(nextHead);

        if (
            !(currHead.row === nextHead.row && currHead.col === nextHead.col)
            && this.isGameOver(cellValue)
        )
            return false;

        if (cellValue === BoardStates.fruit)
            this.snake.grow(this.growIncrement);

        this.grid.setCell(currHead, BoardStates.snakeBody);

        const { head, tail } = this.snake.moveForward();
        this.grid.setCell(head, BoardStates.snakeHead);

        if (tail)
            this.grid.setCell(tail, BoardStates.empty);

        return true;
    }

    private isGameOver(cellValue: number): boolean {
        return cellValue !== BoardStates.empty && cellValue !== BoardStates.fruit;
    }
}

/*

*/