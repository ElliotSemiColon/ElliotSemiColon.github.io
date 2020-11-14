export default class Vector{
    constructor(c, frequency, startpoint){
        this.c = c; //c is a mimicry of a complex constant in the form of an array
        this.omega = frequency; //in revolutions per second (2pi rads^-1)
        this.startpoint = startpoint;
        this.endpoint = {
            x: 0,
            y: 0
        }
    }

    update(timestamp, lastEndPoint){ //calculates vector

        this.startpoint = { //takes the endpoint of the previous vector and starts there
            x: lastEndPoint.x,
            y: lastEndPoint.y
        }

        this.endpoint = { //computers where on the circle around the startpoint the endpoint should be 
            x: lastEndPoint.x+4*(Math.sin(((timestamp/500)*Math.PI*this.omega)+this.c[1]))*this.c[0], //c describes the vectors magnitude and offset ([0] and [1] respectively)
            y: lastEndPoint.y+4*(Math.cos(((timestamp/500)*Math.PI*this.omega)+this.c[1]))*this.c[0]
        }
    }

    draw(ctx){ //renders vector
        ctx.strokeStyle = `white`;
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.arc(this.startpoint.x, this.startpoint.y, 4*this.c[0], 0, 2 * Math.PI);
        ctx.stroke();   

        ctx.beginPath();
        ctx.moveTo(this.startpoint.x, this.startpoint.y);
        
        ctx.lineTo(this.endpoint.x, this.endpoint.y);
        ctx.stroke();
    }
}