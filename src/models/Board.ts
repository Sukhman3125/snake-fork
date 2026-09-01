import { Grid, type GridPosition } from "./Grid";
import { Snake } from "./Snake";

export interface BoardOptions {
    rows: number;
    cols: number;
    snakeHead: GridPosition;
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

    constructor(options: BoardOptions) {
        this.rows = options.rows;
        this.cols = options.cols;
        this.grid = new Grid({ rows: this.rows, cols: this.cols });
        this.snake = new Snake({ headPosition: options.snakeHead, length: 5 });
        this.growIncrement = options.growIncrement ?? 5;
    }

    addFruit(): void;
    addFruit(position: GridPosition): void;

    addFruit(position?: GridPosition): void {
        if (position) {
            if (this.grid.getCell(position) !== 0)
                return;

            this.grid.setCell(position, BoardStates.fruit);
        } else {
            if (this.grid.getCount(BoardStates.empty) === 0)
                return;

            // TODO: keep list of empty cells
            return;
            
            let position: GridPosition = { row: 0, col: 0 };
            // do {
            //     position.row = Math.random() * this.rows;
            //     position.col = Math.random() * this.cols;
            // } while (this.grid.getCell(position) !== BoardStates.empty)

            this.grid.setCell(position, BoardStates.fruit);
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