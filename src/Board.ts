export const BLOCK_SIZE = 20;
export const BOARD_SIZE = 300;
export const BOARD_COLOR = "red";

export default class Board {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private blockSize: number;
    private boardSize: number;

    constructor(idCanvasElement: string, boardColor = BOARD_COLOR, boardSize = BOARD_SIZE, blockSize = BLOCK_SIZE) {
        this.canvas = document.getElementById(idCanvasElement) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.backgroundColor = boardColor;
        this.canvas.width = boardSize;
        this.canvas.height = boardSize;
        this.boardSize = boardSize;
        this.blockSize = blockSize;
    }

    drawBlock(x: number, y: number) {
        this.ctx.fillRect(x, y, this.blockSize, this.blockSize);
        this.ctx.stroke()
    }

    drawFood(x: number, y: number) {
        this.ctx.fillStyle = "#3370d4";
        this.ctx.beginPath();
        this.ctx.arc(x, y, BLOCK_SIZE / 2, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke()
    }

    clear() {
        this.ctx.clearRect(0, 0, this.boardSize, this.boardSize);
        this.ctx.stroke()
    }
}