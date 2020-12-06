console.log("pee");

var c = document.getElementById("ThisIsCanvas");
var ctx = c.getContext("2d");

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

let w=15, // player width and height
    h=15,
    velY=0,
    velX=0,
    speed=5,
    friction=0.95,
    x=500-(w/2),
    y=400-(h/2),
    keys=[],
    frameID=0,
    frameRate=0,
    numberOfEnemies=0,
    enemyRadius=13;
    enemyDetails=[],
    enemyVelocites=[],
    enemySpeed=600, // the higher enemy speed is, the slower they move
    dx=10,
    axisID=0, // spawns enemies on one of four axes
    dy=10,
    d=0,
    ms=0,
    lives=1,
    points=0,
    clockSeconds=0;

function resetEnemy(axis, index, axisSwitch){ // handles the array mess that holds coods and velocities for each enemy
    switch(axisSwitch){
        case 0:
            if (axis=="x"){
                enemyDetails[index*2]=-30; // stores their random coods
            }else if (axis=="y"){
                enemyDetails[(index*2)+1]=Math.floor(Math.random()*800);
            }
            break;
        case 1:
            if (axis=="x"){
                enemyDetails[index*2]=Math.floor(Math.random()*1000); // stores their random coods
            }else if (axis=="y"){
                enemyDetails[(index*2)+1]=-30;
            }
            break;
        case 2:
            if (axis=="x"){
                enemyDetails[index*2]=1030; // stores their random coods
            }else if (axis=="y"){
                enemyDetails[(index*2)+1]=Math.floor(Math.random()*800);
            }
            break;
        case 3:
            if (axis=="x"){
                enemyDetails[index*2]=Math.floor(Math.random()*1000); // stores their random coods
            }else if (axis=="y"){
                enemyDetails[(index*2)+1]=830;
            }   
            break;
        default:
            break;
    }
    enemyVelocites[index*2]=((x+(w/2))-enemyDetails[index*2])/enemySpeed;
    enemyVelocites[(index*2)+1]=((y+(h/2))-enemyDetails[(index*2)+1])/enemySpeed;
}

function rectCircleColliding(circle, rect){
    let distX = Math.abs(circle.x - rect.x-rect.w/2),
        distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    let dx=distX-rect.w/2,
        dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}

function drawEnemies(){ // calculates data for the property arrays containing the locations and velocities of all the enemies using the resetEnemy function
    requestAnimationFrame(drawEnemies);
    Loop1:
    for (i=0; i<=numberOfEnemies; i++){
        
        let circle={x:enemyDetails[i*2],y:enemyDetails[(i*2)+1],r:enemyRadius},
        rect={x:x,y:y,w:w,h:h};
        let collision = rectCircleColliding(circle, rect);
        if (collision){
            lives=0;
            break Loop1;
        }
        
        axisID = Math.floor(Math.random()*4);
        let resetPosition=(enemyDetails[i*2]==undefined) || (enemyDetails[i*2]>=1000+30) || (enemyDetails[i*2]<-30) || (enemyDetails[(i*2)+1]==undefined) || (enemyDetails[(i*2)+1]>800+30) || (enemyDetails[(i*2)+1]<-30);
        if (resetPosition){
            resetEnemy("x", i, axisID);
            resetEnemy("y", i, axisID);
        }
        enemyDetails[i*2]+=enemyVelocites[i*2];
        enemyDetails[(i*2)+1]+=enemyVelocites[(i*2)+1];
        
        ctx.beginPath();
        ctx.arc(enemyDetails[i*2], enemyDetails[(i*2)+1], enemyRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "pink";
        ctx.stroke();

        /*
        ctx.fillStyle = "rgba(250,50,50,0.5)";
        ctx.fillRect(enemyDetails[i*2],enemyDetails[(i*2)+1],25,25);
        */
    }
}

function drawPlayer(){
    requestAnimationFrame(drawPlayer);

    frameID+=1; // fps counter and such
    clockSeconds=frameID/60;

    // check for key input
    if (keys[38]) {
        if (velY > -speed) {
            velY--;
        }
    }
    
    if (keys[40]) {
        if (velY < speed) {
            velY++;
        }
    }
    if (keys[39]) {
        if (velX < speed) {
            velX++;
        }
    }
    if (keys[37]) {
        if (velX > -speed) {
            velX--;
        }
    }

    velY*=friction;
    y+=velY;
    velX*=friction;
    x+=velX;

    if (x>=1000-w) {
        x=1000-w;
        velX*=-1;
    } else if (x<=0) {
        x=0;
        velX*=-1;
    }

    if (y>800-h) {
        y=800-h;
        velY*=-1;
    } else if (y<=0) {
        y=0;
        velY*=-1;
    }
    
    ctx.clearRect(0,0,1000,800); 
    ctx.fillStyle = "rgba(25,25,50,1)";
    ctx.fillRect(0,0,1000,800)
    
    if (lives==1){
        ctx.fillStyle = "rgba(50,255,50,1)";
        ctx.fillRect(x,y,w,h); // draws the player while alive
    if (clockSeconds>=10.7){
        ctx.textAlign = "right";
        ctx.font = "25px Roboto";
        ctx.fillStyle = "#32ff32";
        points=Math.floor(frameID/(60/(frameID/500)));
        ctx.fillText(points+" POINTS", 995, 795);
    }  
    }else{
        ctx.font = "50px Roboto";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("YOU DIED", 500, 400);
        ctx.font = "25px Roboto";
        ctx.fillStyle = "#32ff32";
        ctx.fillText(points+" points", 500, 425);
    }
}

function difficultyScale(){
    requestAnimationFrame(difficultyScale);
    numberOfEnemies=Math.floor(frameID/960);
    enemySpeed-=(frameID/(12000*(frameID/2.5)));
}

function dialogue(){
    requestAnimationFrame(dialogue);
    ctx.font = "50px Roboto";
    let speak = (clockSeconds>=1)&&(clockSeconds<=2);
    if (speak){
        ctx.fillStyle = "pink";
        ctx.textAlign = "center";
        ctx.fillText("SEE THAT BULLET?", 500, 200);
    } 
    speak = (clockSeconds>=3)&&(clockSeconds<=5.5);
    if (speak){
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("IT WANTS YOU DEAD!", 500, 200);
    }
    speak = (clockSeconds>=7)&&(clockSeconds<=9.5);
    if (speak){
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("DODGE!", 500, 175);
        ctx.font = "25px Roboto";
        var gradient = ctx.createLinearGradient(0, 0, c.width, 0);
        gradient.addColorStop("0", "green");
        gradient.addColorStop("0.65", "orange");
        gradient.addColorStop("0.8", "red");
        ctx.fillStyle = gradient;
        ctx.fillText("THE GAME GETS HARDER AS YOU PROGRESS", 500, 225);
    } 
    ctx.font = "50px Roboto";
    speak = (clockSeconds>=10)&&(clockSeconds<=10.6);
    if (speak){
        ctx.fillStyle = "pink";
        ctx.textAlign = "center";
        ctx.fillText("GOOD LUCK <3", 500, 200);
        enemySpeed-=12.7;
    }
}

// main loops

drawPlayer(); // drawPlayer must come first as it clears the screen, after which all objects must be drawn
drawEnemies();
difficultyScale();
dialogue();

// yeah girl you like that dick yeah balls too
