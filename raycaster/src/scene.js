import LineSegment from "/projects/raycaster/src/line.js";
import Point from "/projects/raycaster/src/point.js";
import Intersection from "/projects/raycaster/src/intersection.js";

export default class Scene{
    constructor(){ //Point(spawnx, spawny, draggable)
        this.lineSegments = [new LineSegment(new Point(100,100,true), new Point(200,200,true)),
            new LineSegment(new Point(200,100,true), new Point(100,200,true))];
        this.points;
        this.intersection = new Intersection(10,10); //intersection is never draggable but inherits from point
        this.intersectingLines = [0,1] //index of the lines you wanna perform the calculation on
        this.isIntersecting = false;
    }

    initialise(){
        this.points = [];
        this.lineSegments.forEach(lineSegment => {
            this.points.push(lineSegment.start);
            this.points.push(lineSegment.end);
        });
    }

    update(){ //intersection
        this.lineSegments.forEach(lineSegment =>{
            lineSegment.update();
        });
        let line1 = this.lineSegments[this.intersectingLines[0]]
        let line2 = this.lineSegments[this.intersectingLines[1]];
        //computes intersection
        let denominator = (line1.A*line2.B - line2.A*line1.B);

        if(denominator == 0){
            this.isIntersecting = false;
        }else{
            let xDividend = line2.B*line1.C - line1.B*line2.C;
            let yDividend = line1.A*line2.C - line2.A*line1.C;
            let x = xDividend/denominator; //x and y of the intersection
            let y = yDividend/denominator;
            let rx0 = (x-line1.start.position.x)/(line1.end.position.x-line1.start.position.x); //if bigger than 1 or smaller than 0, intersection is not within line segment
            let ry0 = (y-line1.start.position.y)/(line1.end.position.y-line1.start.position.y);
            let rx1 = (x-line2.start.position.x)/(line2.end.position.x-line2.start.position.x); 
            let ry1 = (y-line2.start.position.y)/(line2.end.position.y-line2.start.position.y);
            if(rx0>=1||rx1>=1||ry0>=1||ry1>=1||rx0<=0||rx1<=0||ry0<=0||ry1<=0){ //these ratios combined determine if the line intersects
                //console.log(rx0,rx1,ry0,ry1);
                this.isIntersecting = false;
            }else{
                this.intersection.position.x = x;
                this.intersection.position.y = y;
                this.isIntersecting = true;
            }
        }
    }

    draw(ctx){ //draw lines and points
        this.lineSegments.forEach(lineSegment =>{
            lineSegment.draw(ctx);
        });
        if(this.isIntersecting){this.intersection.draw(ctx);}
    }

}