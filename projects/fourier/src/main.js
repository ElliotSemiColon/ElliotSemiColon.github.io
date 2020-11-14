import VectorHandler from "/projects/fourier/src/vectorhandler.js";
import Graph from "/projects/fourier/src/graph.js"

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const c = [300, Math.PI/2]; //initial magnitude and offset (pi/2 being 0 radians from the right horizontal)
let handler = 0; 
let graph = 0; //last number is the number of points on the graph

const input = document.querySelector('input');
input.addEventListener('input', updateValue);
let circles = 0;

function updateValue(e){
    circles = e.target.value;
    //console.log(`calculating with ${e.target.value} circles`);
}

window.addEventListener('keydown', keyPressed);
let keypressed = false;

function keyPressed(event){
    //console.log(event.keyCode);
    if(event.keyCode === 13 && keypressed == false){
        if((circles > 0) && (circles < 2000)){setup(circles);}else{setup(7);}
    }
}

function setup(circles){
    console.log(`setting up with ${circles} circles...`);
    keypressed = true;
    
    let middleOfScreen = {
        x: canvas.width/2,
        y: canvas.height/2
    }

    handler = new VectorHandler(circles, 0.25, c, middleOfScreen); //first number denotes the number of circles, second is the frequency in turns per second 
    graph = new Graph({x: 0, y: 0}, 100/handler.omega);
    handler.createVector();
    //console.log(handler.vectors);
    
    window.addEventListener('resize', viewportResized, false);
    
    function viewportResized(){ //resizes canvas to window with viewport resize
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        handler.resized({x: window.innerWidth/2.75, y: window.innerHeight/2});
        graph.resized({x: window.innerWidth/1.5, y: window.innerHeight/2});
    }
    
    viewportResized();

    mainLoop();
}
/*
function drawVector(ctx, timestamp, c){
    ctx.strokeStyle = `white`;
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, c[0], 0, 2 * Math.PI);
    ctx.stroke();   

    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);

    let endpointX = (canvas.width/2)+(Math.sin(((timestamp/500)*Math.PI)+c[1]))*c[0];
    let endpointY = (canvas.height/2)+(Math.cos(((timestamp/500)*Math.PI)+c[1]))*c[0];
    
    ctx.lineTo(endpointX, endpointY);
    ctx.stroke();
}*/

function mainLoop(timestamp){

    ctx.fill = `black`;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    let endpoint = handler.calculate(timestamp, ctx); //gets endpoint and renders visuals
    graph.update(endpoint, timestamp);
    graph.draw(endpoint, ctx);

    requestAnimationFrame(mainLoop);
}
