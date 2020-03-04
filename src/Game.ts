import Board,{BOARD_SIZE,BLOCK_SIZE, BOARD_COLOR} from './Board';
import Snake,{Direction} from './Snake';

enum State{
    Playing,
    Pause,
    Win,
    GameOver
}
//to export
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



//do exportu
export default class Game {
    public snake:Snake;
    public board:Board;
    private state:State;

    constructor(idCanvasElement:string,boardColor=BOARD_COLOR,boardSize = BOARD_SIZE,blockSize = BLOCK_SIZE) {
        this.board = new Board(idCanvasElement);
        this.state = State.Pause;
        this.snake = new Snake(BLOCK_SIZE);
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

    drawSnake():void{
        for(const block of this.snake){
            this.board.drawBlock(block.x,block.y);
        }
    }

    checkForCollision():boolean{
        if(this.snake.head.prev.x < -BLOCK_SIZE) return true;
        if(this.snake.head.prev.y < -BLOCK_SIZE) return true;
        if(this.snake.head.prev.x > BOARD_SIZE) return true;
        if(this.snake.head.prev.y > BOARD_SIZE) return true;
        return false;
    }

    generateFood(){

    }

    handleGameState():void{
        switch (this.state) {
            case State.GameOver:
                this.gameOver();
                break;
            case State.Win:
                this.win();
                break;
            default:
                break;
        }
    }

    gameOver():void{
        this.board.clear();
        this.board.canvas.style.backgroundColor="black";
    }

    win():void{
        this.board.clear();
        this.board.canvas.style.backgroundColor="green";
    }


    

    public async start(delay=200){
        document.onkeydown = this.checkKey.bind(this); 
        this.state = State.Playing;

        while(this.state === State.Playing){
            this.board.clear();
            this.drawSnake();
            this.snake.move();

            if(this.checkForCollision()) {this.state=State.GameOver; break;}
            await sleep(delay);
        }
        this.handleGameState();

    }


}