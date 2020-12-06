import VectorHandler from "/projects/fourier/src/vectorhandler.js";
import Graph from "/projects/fourier/src/graph.js"

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
 //initial magnitude and offset (pi/2 being 0 radians from the right horizontal)
let handler = 0; 
let graph = 0; //last number is the number of points on the graph
let firstLoop = true;
let startTime;

const inputFrequency = document.getElementById('rads');
inputFrequency.addEventListener('input', updateRads);
const inputCircles = document.getElementById('circles');
inputCircles.addEventListener('input', updateCircles);
let circles = 0;
let frequency = 0;
let restarts = 0;
let frame = 0;

function updateCircles(e){
    circles = e.target.value;
    //console.log(e.target.value);
    //console.log(`calculating with ${e.target.value} circles`);
}

function updateRads(e){
    frequency = e.target.value;
    //console.log(e.target.value);
    //console.log(`calculating with ${e.target.value} rps`);
}

window.addEventListener('keydown', keyPressed);
let keypressed = false;

function keyPressed(event){
    //console.log(event.keyCode);
    if(event.keyCode === 13/* && keypressed == false*/){
        if((circles > 0) && (circles < 2000) && (frequency)){ //error checking
            setup(circles, frequency);
        }else if((circles > 0) && (circles < 2000)){
            setup(circles, 0.25);
        }else if((frequency > 0)){
            setup(1, frequency);
        }else{
            setup(1, 0.25);
        } //base case for a shit input
    }
}

function setup(circles, frequency){
    console.log(`setting up with ${circles} circles at ${frequency} revolutions per second...`);
    restarts++;
    frame = 0;
    firstLoop = true;
        
    let c = [window.innerHeight/4, Math.PI/2];

    let middleOfScreen = {
        x: canvas.width/2,
        y: canvas.height/2
    }

    handler = new VectorHandler(circles, frequency, c, middleOfScreen); //first number denotes the number of circles, second is the frequency in turns per second 
    graph = new Graph({x: 0, y: 0}, Math.round(70/handler.omega),[]);
    handler.createVector();

    window.addEventListener('resize', viewportResized, false);
    
    viewportResized();

    mainLoop();
}

function viewportResized(){ //resizes canvas to window with viewport resize
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    handler.resized({x: window.innerWidth/2.75, y: window.innerHeight/2});
    graph.resized({x: window.innerWidth/1.5, y: window.innerHeight/2});
}

function mainLoop(timestamp){

    if((firstLoop)&&(timestamp >= 1)){
        startTime = timestamp;
        firstLoop = false;
        console.log(`${startTime}ms`);
    } 
    
    if(startTime){
        ctx.fill = `black`;
        ctx.fillRect(0,0,canvas.width,canvas.height);
        
        let endpoint = handler.calculate(timestamp-startTime, ctx); //gets endpoint and renders visuals
        if((frame%restarts)==0){ //takes readings every restarts number of frames because for some reason it was doing readings faster proportional to the number of restarts /shrug
            graph.update(endpoint, timestamp-startTime);
        }
        graph.draw(endpoint, ctx);
    }

    frame++;

    requestAnimationFrame(mainLoop);
}
