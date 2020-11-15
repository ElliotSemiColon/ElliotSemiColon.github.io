import Vector from "/projects/fourier/src/vector.js";
export default class VectorHandler{
    constructor(vectorNumber, frequency, firstC, initialStartPoint){
        this.vectorNumber = vectorNumber;
        this.omega = frequency;
        this.vectors = [];
        this.firstC = firstC;
        this.count = 0;
        this.initialStartPoint = initialStartPoint;
    }

    createVector(){
        if (this.count >= this.vectorNumber) return;

        if(this.count == 0){ //(this.count+1)*2)-1 is just 2n-1 which is used in the basic squarewave approximation 
            this.vectors.push(new Vector([this.firstC[0]/(Math.PI*(((this.count+1)*2)-1)), Math.PI/2], ((this.count+1)*2)-1, this.initialStartPoint)); //pushes first vector which needs a special case because its the only vector starting in the centre of the screen
            this.vectors[0].update(0, this.initialStartPoint); //updates exactly once to find endpoint of vector and thus startpoint of the next
            this.count++; //increment count 
            this.createVector(); //recurse
        }else{
            //console.log(this.vectors[this.count-1].endpoint);
            this.vectors.push(new Vector([this.firstC[0]/(Math.PI*(((this.count+1)*2)-1)), Math.PI/2], ((this.count+1)*2)-1, this.vectors[this.count-1].endpoint)); //sets start point to the end point of the previous array item 
            this.vectors[this.count].update(0, this.vectors[this.count-1].endpoint); //updates exactly once to find endpoint of vector and thus the startpoint of the next
            this.count++;
            this.createVector();
        }
    }

    resized(middleOfScreen){
        this.vectors[0].startpoint = middleOfScreen;
    }

    calculate(timestamp, ctx){ //calculate updates and renders the vectors
        for(let i = 0; i < this.vectors.length; i++){
            if(i == 0){
                this.vectors[0].update(timestamp*this.omega, this.vectors[0].startpoint);
            }else{
                this.vectors[i].update(timestamp*this.omega, this.vectors[i-1].endpoint);
            }
            this.vectors[i].draw(ctx);
        }
        return this.vectors[this.vectors.length-1].endpoint;
    }
}