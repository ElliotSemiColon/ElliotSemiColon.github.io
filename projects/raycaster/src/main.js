import Scene from "/projects/raycaster/src/scene.js";
import Raycast from "/projects/raycaster/src/raycast.js"
//import LineSegment from "/src/line.js";
//import Point from "/src/point.js";

var canvas = document.getElementById("canvas"); 
var ctx = canvas.getContext("2d"); 
window.addEventListener('resize', resizeCanvas, false);

resizeCanvas();

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let deltaTime = 0, lastTime = 0, fps = 0;
let mouseX = 350, mouseY = 150;
let dragging = false;
let scene = new Scene();
let renderScene = true;
let raycast = new Raycast(150,150);
raycast.generateRays();
//console.log(raycast);
scene.initialise();


function getMouse(event){
    mouseX = event.clientX, mouseY = event.clientY;
}

//interaction handler
canvas.addEventListener('mousedown', (event) => {
    getMouse(event);
    scene.points.forEach(point =>{
        point.click({x: mouseX, y: mouseY});
    });
    dragging = true;
}); 
canvas.addEventListener('mousemove', (event) => {
    if(dragging){
        getMouse(event);
        scene.points.forEach(point =>{
            if(point.dragging){point.drag({x: mouseX, y: mouseY});}
        });
    }
});
canvas.addEventListener('mouseup', (event) => {
    getMouse(event);
    scene.points.forEach(point =>{
        point.dragging = false;
    });
    dragging = false;
}); 
window.addEventListener('keyup', (event) => {
    if(event.code == "KeyM"){
        if(renderScene){renderScene = false;}else{renderScene = true;}
    }
}); 

function mainLoop(timestamp){
    /*setTimeout(function(){*/ //slowed framerate to help sort out rendering bugs
        deltaTime = timestamp - lastTime; //calculates delta time (frame time)
        lastTime = timestamp;
        fps = 1000/deltaTime;
    
        raycast.position = {x: mouseX, y: mouseY};
    
        background();
        raycast.update();
        raycast.intersect(scene);
        //if(dragging){scene.update();}
        //scene.update();
        raycast.draw(ctx);
        if(renderScene){scene.draw(ctx);}
        
        requestAnimationFrame(mainLoop);
    /*}, 500);*/
}

mainLoop();

function background(){
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    text();
}

function text(){
    ctx.fillStyle = '#ffffff';
    ctx.font = "30px Arial";
    ctx.fillText("Simple raycaster", 600, 50); 
    ctx.fillText(`${Math.round(fps)}fps`, 835, 50);
    ctx.font = "20px Arial";
    ctx.fillText("- hold mouse to move light source", 600, 75);
    ctx.fillText("- drag transluscent points", 600, 95);
    ctx.fillText("- press m to toggle walls", 600, 115);
}