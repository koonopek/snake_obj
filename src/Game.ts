import Board, { BOARD_SIZE, BLOCK_SIZE, BOARD_COLOR } from './Board';
import Snake, { Direction, Point } from './Snake';
import Hammer from 'hammerjs';

enum State {
    Playing,
    Pause,
    Win,
    GameOver
}
//to export
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};
//do exportu
export default class Game {
    public snake: Snake;
    public board: Board;
    private state: State;
    private food: Point;

    constructor(idCanvasElement: string, boardColor = BOARD_COLOR, boardSize = BOARD_SIZE, blockSize = BLOCK_SIZE) {
        this.board = new Board(idCanvasElement);
        this.state = State.Pause;
        this.snake = new Snake(BLOCK_SIZE);
        isMobileDevice() ? this.setMobileEvents() : this.setDesktopEvents();
        console.log(isMobileDevice())
    }

    async reset() {
        this.board.clear();
        this.state = State.GameOver;
        this.snake = new Snake(BLOCK_SIZE);
        this.start();
    }

    setMobileEvents() {
        const mc = new Hammer.Manager(window);
        mc.add(new Hammer.Swipe({ event: "sw_right", direction: Hammer.DIRECTION_RIGHT }));
        mc.on("sw_right", () => { this.snake.changeDirection(Direction.Right) });

        mc.add(new Hammer.Swipe({ event: "sw_up", direction: Hammer.DIRECTION_UP }));
        mc.on("sw_up", () => { this.snake.changeDirection(Direction.Up) });

        mc.add(new Hammer.Swipe({ event: "sw_down", direction: Hammer.DIRECTION_DOWN }));
        mc.on("sw_down", () => { this.snake.changeDirection(Direction.Down) });

        mc.add(new Hammer.Swipe({ event: "sw_left", direction: Hammer.DIRECTION_LEFT }));
        mc.on("sw_left", () => { this.snake.changeDirection(Direction.Left) });


        const pause = document.getElementById('pause');
        const mcPause = new Hammer.Manager(pause); mcPause.add(new Hammer.Tap()); mcPause.on('tap', () => {
            if (this.state === State.Pause) this.resume();
            else this.state = State.Pause
        })
        const reset = document.getElementById('reset');
        const mcReset = new Hammer.Manager(reset); mcReset.add(new Hammer.Tap()); mcReset.on('tap',()=>{
            if(this.state === State.GameOver) this.reset();
        })


    }

    resume() {
        this.start();
    }

    checkKey(e) {
        e = e || window.event;
        if (e.keyCode == '38') {
            this.snake.changeDirection(Direction.Up)
        }
        else if (e.keyCode == '40') {
            // down arrow
            this.snake.changeDirection(Direction.Down)
        }
        else if (e.keyCode == '37') {
            // left arrow
            this.snake.changeDirection(Direction.Left)
        }
        else if (e.keyCode == '39') {
            // right arrow
            this.snake.changeDirection(Direction.Right)
        }
    }

    render(): void {
        this.board.clear();
        for (const block of this.snake) {
            this.board.drawBlock(block.x, block.y);
        }
        this.board.drawBlock(this.food.x, this.food.y);
    }

    setDesktopEvents() {
        document.getElementById('pause').addEventListener('click', () => {
            if (this.state === State.Pause) this.resume();
            else this.state = State.Pause
        });
        document.getElementById('reset').addEventListener('click', () => { if(this.state === State.GameOver) this.reset(); })
    }

    checkForCollision(): boolean {
        if (this.snake.head.prev.x < 0) return true;
        if (this.snake.head.prev.y < 0) return true;
        if (this.snake.head.prev.x > BOARD_SIZE) return true;
        if (this.snake.head.prev.y > BOARD_SIZE) return true;
        for (const block of this.snake) {
            if (this.snake.head.prev.x === block.x && this.snake.head.prev.y === block.y && this.snake.head.prev !== block) return true;
        }
        return false;
    }

    checkEat() {
        if (this.snake.head.prev.x === this.food.x && this.snake.head.prev.y === this.food.y) return true;
        return false;
    }

    generateFood() {
        let x = (Math.floor(Math.random() * (BOARD_SIZE / 10)) * BLOCK_SIZE) % BOARD_SIZE;
        let y = (Math.floor(Math.random() * (BOARD_SIZE / 10)) * BLOCK_SIZE) % BOARD_SIZE;
        this.food = { x, y };
    }

    handleGameState(interval?: number): void {
        switch (this.state) {
            case State.GameOver:
                this.gameOver();
                if (interval) clearInterval(interval);
                break;
            case State.Win:
                this.win();
                break;
            case State.Playing:
                this.playing();
                break;
            case State.Pause:
                if (interval) clearInterval(interval);
            default:
                break;
        }
    }

    countScore(): number {
        let score = 0;
        for (const block of this.snake) {
            score++;
        }
        return (score - 1);
    }

    gameOver(): void {
        this.board.clear();
        this.board.canvas.style.backgroundColor = "black";
    }

    win(): void {
        this.board.clear();
        this.board.canvas.style.backgroundColor = "green";
    }

    playing(): void {
        this.board.canvas.style.backgroundColor = "red";
    }

    public async start(delay = 100) {
        document.onkeydown = this.checkKey.bind(this);
        this.generateFood();
        this.state = State.Playing;
        this.handleGameState();

        const interval = setInterval(() => {
            if (this.state === State.Playing) this.snake.move();
            if (this.checkForCollision()) { this.state = State.GameOver; }
        }, delay);

        while (this.state === State.Playing) {
            if (this.checkEat()) { this.snake.eat(); this.generateFood(); this.board.setScore(this.countScore()) }
            this.render();
            await sleep(60);
        }
        this.handleGameState(interval);

    }
}