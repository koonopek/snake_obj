import { BLOCK_SIZE } from './Board';

export default class Snake implements Iterable<Block> {
    
    public head: Block;
    public step: number;
    public direction: Direction;

    constructor(step: number) {
        this.step = step;
        this.direction = Direction.Right;
        this.head = { prev: {prev:null, x:(1)*step,y:(2)*step}, x: 10 * step, y: 3 * step };
    }

    public push(block:Block={x:0,y:0,prev:null}){
        let start = this.head;
        while(start.prev !== null) { start = start.prev;}
        start.prev=block;
    }

    public [Symbol.iterator](): Iterator<Block, any, undefined> {
        let curr = this.head;
        return {
            next:function(){
                console.log('in iterator');
                if(curr.prev === null) return {value:null, done:true}
                else { curr = curr.prev; return {value:curr, done:false}}
            }.bind(this)
        }
    }

    checkForDirections(dir:Direction){
        console.log(`this.dir : ${this.direction} dir: ${dir}`)
        if(dir === Direction.Down && this.direction === Direction.Up) return false
        if(dir === Direction.Up && this.direction === Direction.Down) return false
        if(dir === Direction.Left && this.direction === Direction.Right) return false
        if(dir === Direction.Right && this.direction === Direction.Left) return false
        return true;
    }

    public move(dir:Direction):boolean {
        if(!this.checkForDirections(dir)) return false;
        this.direction = dir;

        switch (dir) {
            case Direction.Right:
                this.head.prev.x+=this.step;
                break;
            case Direction.Left:
                this.head.prev.x-=this.step;
            case Direction.Up:
                this.head.prev.y+=this.step;
                break;
            case Direction.Down:
                this.head.prev.y-=this.step;
        }

        for (const block of this){
            if(block.prev !== null){block.x = block.prev.x; block.y = block.prev.y;}
        }
        return true;
    }

    eat(){
        this.push();
        this.move(this.direction);//bug maybe?
    }
}

type Block = {
    prev: Block | null;
    x: number,
    y: number
}

enum Direction {
    Up,
    Down,
    Left,
    Right
}