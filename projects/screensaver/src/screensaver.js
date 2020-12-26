let canvas = document.getElementById("canvas"); 
let ctx = canvas.getContext("2d"); 
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let speed = 0.3;

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

function main(timestamp){
    
    if(timestamp){
        let x = timestamp*speed/1000
        let rgb = rainbow(x);
        console.log(rgb.b, rgb.r, rgb.g);
        let colour1 = rgbToHex(rgb.r, rgb.g, rgb.b);
        //let colour2 = rgbToHex(rgb.b, rgb.r, rgb.g);
        let colour2 = rgbToHex(rgb.g, rgb.b, rgb.r);
        //console.log(colour1, colour2);
    
        ctx.fillStyle = makeGradient(colour1, colour2, x);
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    
    requestAnimationFrame(main);
}

main();