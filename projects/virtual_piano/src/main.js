import Controller from "/project/virtual_piano/src/controller.js"
import Text from "/project/virtual_piano/src/text.js"
import SoundHandler from "/project/virtual_piano/src/soundhandler.js"
import Songs from "/project/virtual_piano/src/songs.js"
console.log("initialized");

let canvas = document.getElementById("ThisIsCanvas");
var ctx = canvas.getContext("2d"); //gives the renderer context

let controller = new Controller();
let text = new Text(0, 0, 150, "Times New Roman", "rgba(10, 10, 20, 1)", "center", controller);
let soundhandler = new SoundHandler();
let songs = new Songs();

document.body.addEventListener("keydown", function (e) { //when key pressed, the pressed keycode is fed to the controller object
    controller.checkKey(e.keyCode, 1); //sets the arrowkey direction to '1'
});
document.body.addEventListener("keyup", function (e) { //when key released, the released keycode is fed to the controller object
    controller.checkKey(e.keyCode, 0); //resets the arrowkey direction to '0'
});

function drawBackground(){
    ctx.fillStyle = "rgba(230,200,220,0.25)" //colour of background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(230,230,230,1)" //colour of background
    ctx.fillRect(canvas.width/8, canvas.height/4, canvas.width-(canvas.width/4), canvas.height-(canvas.height/2));
}

function mainLoop(timestamp){
    
    drawBackground();

    text.update(canvas);
    text.draw(ctx, controller);

    if(controller.preProgrammedSongs != 0){
        controller.notes = songs.update(timestamp, controller.preProgrammedSongs-1);
    }else{
        if(songs.started == true){
            controller.notes = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            songs.started = false;
        }
    }

    soundhandler.play(controller);

    requestAnimationFrame(mainLoop);
}

mainLoop();