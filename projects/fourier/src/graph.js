export default class Graph{
    constructor(position, graphResolution){
        this.position = position;
        this.inputStream = [];
        this.graphResolution = graphResolution;
    }

    update(input, timestamp){
        this.inputStream.push({x: this.position.x, y: input.y});
        if(this.inputStream.length > this.graphResolution){
            this.inputStream.shift(); //removes items if list gets too long
        }
        for(let i = 0; i < this.inputStream.length; i++){
            this.inputStream[i].x += 500/this.graphResolution;
        }
    }

    resized(middleOfScreen){
        this.position = middleOfScreen;
    }

    draw(endpoint, ctx){
        ctx.strokeStyle = `white`;
        ctx.lineWidth = 3;
    
        ctx.beginPath();
        for(let i = 0; i < this.inputStream.length; i++){
            ctx.lineTo(this.inputStream[i].x, this.inputStream[i].y);
        }
        ctx.lineTo(endpoint.x, endpoint.y);
        ctx.moveTo(this.position.x, this.position.y);
        ctx.stroke();

    }
    
}