let canvas = document.getElementById("canvas"); 
let ctx = canvas.getContext("2d"); 
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let speed = 0.03;

function toHex(int){
    let hex = int.toString(16);
    return hex.length == 1 ? `0${hex}`: hex;
}

function rgbToHex(r,g,b){
    //console.log(rgb);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function rainbow(x){
    let r = Math.round(Math.pow(Math.sin(x+(Math.PI/1.5))+1, 2)*113.3);
    let g = Math.round(Math.pow(Math.sin(x+(Math.PI/0.75))+1, 2)*113.3);
    let b = Math.round(Math.pow(Math.sin(x+(Math.PI/0.5))+1, 2)*113.3);
    let colour = {
        r: r > 255 ? 255: r,
        g: g > 255 ? 255: g,
        b: b > 255 ? 255: b
    }
    return colour;
}

function makeGradient(colour1, colour2, x){
    let gradient = ctx.createLinearGradient(0,Math.tan(x)*-100,canvas.width,Math.tan(x)*100);
    gradient.addColorStop(0, colour1);
    gradient.addColorStop(1, colour2);
    return gradient;
}

function chooseColour(one, two, three){
    let chosenColours = [0,1];
    let colours = [one, two, three];
    let randInt = Math.round(Math.random()*100);
    return [colours[0], colours[1]];
}

function main(timestamp){
    
    if(timestamp){
        let x = timestamp*speed/1000
        let rgb = rainbow(x*3);
        //console.log(rgb.b, rgb.r, rgb.g);
        let colour1 = rgbToHex(rgb.r, rgb.g, rgb.b);
        //let colour2 = rgbToHex(rgb.b, rgb.r, rgb.g);
        let colour2 = rgbToHex(rgb.g, rgb.b, rgb.r);
        let colour3 = rgbToHex(rgb.b, rgb.r, rgb.g);
        //console.log(colour1, colour2);
    
        let colours = chooseColour(colour1, colour2, colour3);

        ctx.fillStyle = makeGradient(colours[0], colours[1], x);
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    
    requestAnimationFrame(main);
}

main();