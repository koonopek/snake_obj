import Board,{BOARD_SIZE,BLOCK_SIZE, BOARD_COLOR} from './Board';
import Snake,{Direction,Point} from './Snake';

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
    private food:Point;

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

    render():void{
        for(const block of this.snake){
            this.board.drawBlock(block.x,block.y);
        }
        this.board.drawBlock    (this.food.x,this.food.y);
    }

    checkForCollision():boolean{
        if(this.snake.head.prev.x < -BLOCK_SIZE) return true;
        if(this.snake.head.prev.y < -BLOCK_SIZE) return true;
        if(this.snake.head.prev.x > BOARD_SIZE) return true;
        if(this.snake.head.prev.y > BOARD_SIZE) return true;
        for(const block of this.snake){
            if(this.snake.head.prev.x === block.x && this.snake.head.prev.y === block.y && this.snake.head.prev !== block){return true;}
        }
        return false;
    }

    checkEat(){
        // console.log(`Check eat: x:${(this.food.x - BsLOCK_SIZE) - this.snake.head.prev.x}  y:${this.food.y + BLOCK_SIZE - this.snake.head.prev.y} `)
        if(this.snake.head.prev.x === this.food.x  && this.snake.head.prev.y === this.food.y) return true;
        return false;
    }

    generateFood(){
        let x = (Math.floor(Math.random() * (BOARD_SIZE/10))*BLOCK_SIZE) % BOARD_SIZE;
        let y = (Math.floor(Math.random() * (BOARD_SIZE/10))*BLOCK_SIZE) % BOARD_SIZE;
        console.log(x,y);
        this.food={x,y};
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
        this.generateFood();
        this.state = State.Playing;
        this.snake.eat();
        this.snake.eat();
        this.snake.eat();
        this.snake.eat();
        
        while(this.state === State.Playing){
            this.board.clear();
            this.render();
            this.snake.move();

            if(this.checkForCollision()) {this.state=State.GameOver; break;}
            if(this.checkEat()){this.snake.eat();this.generateFood();}

            await sleep(delay);
        }
        this.handleGameState();

    }


}