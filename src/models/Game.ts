import { Board, type BoardEvent, type BoardOptions } from "./Board";
import { GridRenderer, type GridRendererOptions } from "./GridRenderer";
import { Directions } from "./Snake";

export interface GameOptions extends BoardOptions, GridRendererOptions {
    paused?: boolean;
    ticksPerSec?: number;
}

export class Game {
    private board;
    private renderer;
    private paused;
    private ticksPerSec: number;

    constructor(options: GameOptions) {
        const { rows, cols, snakeHead, snakeDirection, snakeLength, growIncrement, ctx, gridStyle, palette, paused, ticksPerSec } = options;
        this.board = new Board({ rows, cols, snakeHead, snakeDirection, snakeLength, growIncrement });
        this.renderer = new GridRenderer({ ctx, gridStyle, palette });

        this.paused = paused ?? true;
        this.ticksPerSec = ticksPerSec ?? 2;

        this.setSpeed(this.ticksPerSec);
        this.addKeyboardInputs();
        this.render();

        if (!paused)
            this.loop();
    }

    private loop() {
        if (this.paused)
            return;

        const shouldContinue = this.tick();

        if (shouldContinue) {
            setTimeout(() => this.loop(), 1000 / this.ticksPerSec);
        }
    }

    private tick() {
        const event: BoardEvent = this.board.update();
        this.render();

        if(event.type === "collision"){
            window.alert("Game Over: collision with " + event.with);
        }

        return event.type !== "collision";
    }

    private render() {
        this.renderer.drawGrid(this.board.grid);
    }

    setSpeed(ticksPerSec: number) {
        this.ticksPerSec = Math.floor(ticksPerSec);
        if (this.ticksPerSec <= 0)
            this.ticksPerSec = 2;
        else
            this.ticksPerSec = ticksPerSec;
    }

    //#region play/pause
    play() {
        if (!this.paused)
            return;

        this.paused = false;
        this.loop();
    }
    pause() {
        if (this.paused)
            return;

        this.paused = true;
    }
    togglePause() {
        if (this.paused)
            this.play();
        else
            this.pause();
    }
    //#endregion

    //#region inputs
    private readonly keyMap: Record<string, () => void> = {
        ArrowUp: () => this.board.setSnakeDirection(Directions.up),
        ArrowRight: () => this.board.setSnakeDirection(Directions.right),
        ArrowDown: () => this.board.setSnakeDirection(Directions.down),
        ArrowLeft: () => this.board.setSnakeDirection(Directions.left),

        Space: () => this.togglePause(),
        Enter: () => this.play(),
        Escape: () => this.pause(),
    };

    private addKeyboardInputs() {
        window.addEventListener("keydown", (event) => {
            const action = this.keyMap[event.code];

            if (!action) return;

            action();
        });
    }
    //#endregion
};