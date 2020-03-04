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

    public changeDirection(dir:Direction){
        if(!this.checkForDirections(dir)) return false;
        this.direction = dir;
    }

    public move():boolean {
        const dir = this.direction;
        let tmpBox = {x:this.head.prev.x,y:this.head.prev.y,prev:this.head.prev.prev};
        switch (dir) {
            case Direction.Right:
                tmpBox.x+=this.step;
                break;
            case Direction.Left:
                tmpBox.x-=this.step;
                break;
            case Direction.Up:
                tmpBox.y-=this.step;
                break;
            case Direction.Down:
                tmpBox.y+=this.step;
        }
        let newPositions:Point[] = [];

        for (const block of this){
            if(block.prev !== null){ newPositions.push({x:block.x,y:block.y})}
        }
        let i=0;
        for (const block of this){
            if(this.head.prev === block) continue;
            block.x = newPositions[i].x;
            block.y = newPositions[i].y;
            i++;
        }

        

        this.head.prev = tmpBox;
        return true;
    }

    eat(){
        let curr = this.head;
        while(curr.prev !== null){curr = curr.prev;}
        curr.prev={x:curr.x,y:curr.y,prev:null};
    }
}

type Block = {
    prev: Block | null;
    x: number,
    y: number
}

export enum Direction {
    Up,
    Down,
    Left,
    Right
}
export type Point = {
     x:number,
     y:number
 }