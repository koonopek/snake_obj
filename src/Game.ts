import Board,{BOARD_SIZE,BLOCK_SIZE, BOARD_COLOR} from './Board';
import Snake from './Snake';

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

    drawSnake(){
        for(const block of this.snake){
            this.board.drawBlock(block.x,block.y);
        }
    }


    public start(delay:number){
        let stop = 0;
        let currentDir = this.snake.direction;
        while(!stop){
            this.drawSnake();
            this.snake.move(currentDir);
            
            

            sleep(1000);
        }

    }


}