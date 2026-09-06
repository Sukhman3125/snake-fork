import { Board, type BoardEvent, type BoardOptions } from "./Board";
import { GridRenderer, type GridRendererOptions } from "./GridRenderer";
import { Directions } from "./Snake";

export interface GameOptions extends BoardOptions, GridRendererOptions {
    paused?: boolean;
    ticksPerSec?: number;
    setPaused?: (paused: boolean) => void;
    setDeath?: (death: boolean) => void;
    setLength?: (length: number) => void;
}

export class Game {
    private board: Board;
    private renderer: GridRenderer;

    private paused: boolean;
    private died: boolean;

    private ticksPerSec: number;
    private loopId: number | null;

    private setDeath: (paused: boolean) => void;
    private setPaused: (death: boolean) => void;
    private setLength: (length: number) => void;

    constructor(options: GameOptions) {
        this.board = new Board(options);
        this.renderer = new GridRenderer(options);

        this.paused = options.paused ?? true;
        this.ticksPerSec = options.ticksPerSec ?? 2;
        this.loopId = null;

        this.setSpeed(this.ticksPerSec);
        this.addKeyboardInputs();
        this.board.addFruit();

        this.died = false;
        this.setDeath = options.setDeath ?? (() => { });
        this.setPaused = options.setPaused ?? (() => { });
        this.setLength = options.setLength ?? (() => { });

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
        if (!this.paused || this.loopId !== null || this.died)
            return;

        this.paused = false;
        this.setPaused(this.paused);
        this.loopId = setTimeout(() => this.loop(), 1000 / this.ticksPerSec);
    }
    pause() {
        this.paused = true;
        if (this.loopId !== null) {
            clearTimeout(this.loopId);
            this.loopId = null;
            this.setPaused(this.paused);
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
        if (this.paused || this.died)
            return;

        const event = this.tick();
        if (event.type === "collision") {
            this.died = true;
            this.setDeath(this.died);
            this.loopId = null;
            return;
        }

        if (event.type === "fruit-eaten") {
            this.board.addFruit();
        }
        this.setLength(this.board.snakeLength);

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

        // KeyR: () => this.reset()
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