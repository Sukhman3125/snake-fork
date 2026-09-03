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
    private loopId: number | null;

    constructor(options: GameOptions) {
        const { rows, cols, snakeHead, snakeDirection, snakeLength, growIncrement, ctx, gridStyle, palette, paused, ticksPerSec } = options;
        this.board = new Board({ rows, cols, snakeHead, snakeDirection, snakeLength, growIncrement });
        this.renderer = new GridRenderer({ ctx, gridStyle, palette });

        this.paused = paused ?? true;
        this.ticksPerSec = ticksPerSec ?? 2;
        this.loopId = null;

        this.setSpeed(this.ticksPerSec);
        this.addKeyboardInputs();
        this.board.addFruit();

        this.render();
    }

    setSpeed(ticksPerSec: number) {
        const pausedState = this.paused;
        this.pause();

        this.ticksPerSec = Math.max(1, Math.floor(ticksPerSec));

        if (!pausedState)
            this.play();
    }

    //#region play/pause
    play() {
        if (!this.paused || this.loopId !== null)
            return;

        this.paused = false;
        this.loopId = setTimeout(() => this.loop(), 1000 / this.ticksPerSec);
    }
    pause() {
        this.paused = true;
        if (this.loopId !== null) {
            clearTimeout(this.loopId);
            this.loopId = null;
        }
    }
    togglePause() {
        if (this.paused)
            this.play();
        else
            this.pause();
    }
    //#endregion

    //#region game loop
    private loop() {
        if (this.paused)
            return;

        const event = this.tick();
        if (event.type === "collision") {
            window.alert("Game Over: collision with " + event.with);
            this.loopId = null;
            return;
        }

        if (event.type === "fruit-eaten") {
            this.board.addFruit();
        }

        this.loopId = setTimeout(() => this.loop(), 1000 / this.ticksPerSec);
    }

    private tick(): BoardEvent {
        const event: BoardEvent = this.board.update();
        this.render();

        return event;
    }

    private render() {
        this.renderer.drawGrid(this.board.grid);
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

    private readonly handleKeyDown = (event: KeyboardEvent) => {
        const action = this.keyMap[event.code];

        if (!action) return;

        action();
    };

    private addKeyboardInputs() {
        window.addEventListener("keydown", this.handleKeyDown);
    }

    destroy() {
        this.pause();
        window.removeEventListener("keydown", this.handleKeyDown);
    }
    //#endregion
};