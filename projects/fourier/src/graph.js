export default class Graph{
    constructor(position, graphResolution, inputStream){
        this.position = position;
        this.inputStream = inputStream;
        this.graphResolution = graphResolution;
    }

    update(input, timestamp){
        this.inputStream.push({x: this.position.x, y: input.y, creationTime: timestamp});
        /*if(this.inputStream.length > this.graphResolution){
            this.inputStream.shift(); //removes items if list gets too long
        }*/
        let i;
        for(i = 0; i < this.inputStream.length; i++){
            this.inputStream[i].x = ((timestamp-this.inputStream[i].creationTime)/20)+this.position.x;
            if(this.inputStream[i].x >= this.position.x+400){
                this.inputStream.splice(i,1); //cuts out any points thatre going off the screen
            }
            //this.inputStream[i].x = ((this.inputStream.length-i)/(this.graphResolution/550))+this.position.x;
        }
        //console.log(i);
    }

    resized(middleOfScreen){
        this.position = middleOfScreen;
    }

    draw(endpoint, ctx){
        ctx.strokeStyle = `rgba(255,255,255,1)`;
        ctx.lineWidth = 3;
    
        ctx.beginPath();
        let i;
        for(i = 0; i < this.inputStream.length; i++){
            ctx.lineTo(this.inputStream[i].x, this.inputStream[i].y);
        }
        ctx.stroke();
        
        ctx.strokeStyle = `rgba(255,255,255,0.2)`;
        ctx.beginPath();
        ctx.lineTo(this.inputStream[this.inputStream.length-1].x, this.inputStream[this.inputStream.length-1].y);
        ctx.lineTo(endpoint.x, endpoint.y);
        ctx.stroke();
    }
    
}