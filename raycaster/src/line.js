export default class LineSegment{
    constructor(point1, point2){
        this.start = point1;
        this.end = point2;
        this.width = 2;
        this.visible = true
        this.A, this.B, this.C;
    }

    update(){
        this.A = this.end.position.y - this.start.position.y;
        this.B = this.start.position.x - this.end.position.x;
        this.C = this.A*this.start.position.x + this.B*this.start.position.y;
    }

    draw(ctx){
        this.drawLine(ctx);
        this.drawPoints(ctx);
    }
    
    drawPoints(ctx){
        this.start.draw(ctx);
        this.end.draw(ctx);
    }

    drawLine(ctx){
        ctx.beginPath();
        ctx.moveTo(this.start.position.x, this.start.position.y);
        ctx.lineTo(this.end.position.x, this.end.position.y);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = this.width;
        ctx.stroke(); 
    }
}