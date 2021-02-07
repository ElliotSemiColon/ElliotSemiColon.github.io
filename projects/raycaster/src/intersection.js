import Point from "/projects/raycaster/src/point.js";

export default class Intersection extends Point{ //i be inheriting doe
    constructor(x,y){
        super(x,y,false);
        this.radius = 15;
        this.colour = 'red';
    }

    draw(ctx){
        ctx.beginPath(); 
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false); 
        ctx.strokeStyle = this.colour;
        ctx.lineWidth = 2;
        ctx.stroke(); 
    }
}