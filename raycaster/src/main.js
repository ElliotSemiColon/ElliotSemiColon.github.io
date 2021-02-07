import Scene from "/projects/raycaster/src/scene.js";
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

let deltaTime = 0, lastTime = 0;
let mouseX, mouseY;
let scene = new Scene();
scene.initialise();
scene.update();

let dragging = false;

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
        scene.update();
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
    scene.update();
}); 

function mainLoop(timestamp){
    deltaTime = timestamp - lastTime; //calculates delta time (frame time)
    lastTime = timestamp;
    
    background();
    scene.draw(ctx);
    //if(dragging){scene.update();}

    requestAnimationFrame(mainLoop);
}

mainLoop();

function background(){
    ctx.fillStyle = '#2C2F33';
    ctx.fillRect(0,0,canvas.width,canvas.height);
}
