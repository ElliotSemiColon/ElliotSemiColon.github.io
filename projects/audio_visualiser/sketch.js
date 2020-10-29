//id like to formally apologise for the italian style code in this one - im new to this library
/*Copyright 2020 ElliotSemiColon

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

let size = 0.75;
let fft;
let backgroundImg;
let songArray = [];
let fps = 120;
let spectrum;
let currentSong = 0;
let soundsToLoad = 0;
let range = { //frequency range in Hertz (max is 22000)
  start: 0, //this needs to be zero for now since i havent got it working right just yet
  end: 400,
  bins: Math.pow(2, 12)
};
let s_shake = {
  freq: 0,
  freqReactivity: 0.015,
  amplitude: 0,
  ampReactivity: 0.0000015,
  x: 0,
  y: 0,
  offset: 0,
  smoothing: 15,
  xBackground: 0,
  yBackground: 0
};
let drop = {
  times: [  //song's drop start and stop times in seconds
    [0,0],
    [0,0]
  ],
  gain: 2.5 //s_shake amp and xbar coefficient
}
let progressBarWidth = 0;
let loadBarWidth = 0;
let deadFrames = 0;
let justFinishedLoading;
let numberFilesInput = 1;
let xBar = 0;
let bump = 2.5; //how much the backgroundImg reacts to average volume
let r=0, g=0, b=0;
let zoom = 0.05; //decimal multiplier(+1) for image size
let circleDisplay = false;
let rainbowDisplay = true;
let warningDisplay = false;
let autoPlay = true;
let innerRadius = 0;
let timeStarted = 0;
let ms = 0;
let offset = 0;
let angleOffset = 0;
let darkness = 0;

function preload(){
  console.log('initialising');
  //image in file directory

  backgroundImg = loadImage('lib/background5.png');
  logoImg = loadImage('lib/logo.png')

  //default song

  songArray.push(loadSound('lib/Au5 - Interstellar (feat. Danyka Nadeau) [NCS Release].mp3'));

  //handles user file input initially, specifies error etc. callbacks

  const input = document.querySelector('input[id="input"]');
  input.addEventListener('change', function (e){
    console.log(input.files);
    numberFilesInput = input.files.length;
    for(let i = 0; i < input.files.length; i++){
      songArray.push(loadSound(input.files[i], soundLoaded, loadingFailed, whileLoading));
      soundsToLoad++;
    }
    console.log(songArray);
  }, false);
}

//user-loaded sound callbacks

function soundLoaded(){
  console.log('loaded sound!');
  soundsToLoad--;
}

function loadingFailed(e){
  console.log(`failed with error ${e}`);
}

function whileLoading(total){
}

function keyPressed() {
  if (keyCode === 80) { // P for pause
    toggleSong();
  } else if (keyCode === ENTER) {
    switchSong();
  } else if (keyCode === SHIFT){ 
    toggleUI();
  } else if (keyCode === 163){ // # key toggles inner circle
    if(circleDisplay){circleDisplay = false;}else{circleDisplay = true;}
  } else if (keyCode === 221){ // ] key toggles rainbow
    if(rainbowDisplay){rainbowDisplay = false;}else{rainbowDisplay = true;}
  } else if (keyCode === 61){ // = key toggles warning disp
    if(warningDisplay){warningDisplay = false;}else{warningDisplay = true;}
  } else if (keyCode === 219){ // - key toggles autoplay
    autoPlayToggle();
  }
}

function toggleSong(){
  if (soundsToLoad < 1){
    if(songArray[currentSong].isPlaying()){
      songArray[currentSong].pause();
      deadFrames = 0;
    }else{
      songArray[currentSong].play();
      timeStarted = ms;
    }
  }
}

function toggleUI(){
  if(document.getElementById('custom-button').style.display == "none"){
    document.getElementById('custom-button').style.display = "block";
    document.getElementById('header').style.display = "block";
    document.getElementById('song-header').style.display = "block";
    document.getElementById('song-display').style.display = "block";
    buttonSwitch.show();
    buttonToggle.show();
    buttonAutoPlay.show();
  }else{
    document.getElementById('custom-button').style.display = "none";
    document.getElementById('header').style.display = "none";
    document.getElementById('song-header').style.display = "none";
    document.getElementById('song-display').style.display = "none";
    buttonSwitch.hide();
    buttonToggle.hide();
    buttonAutoPlay.hide();
  }
}

function switchSong(){
  if((songArray.length > 1)&&(soundsToLoad < 1)){
    songArray[currentSong].stop();
    progressBarWidth = 0;
    currentSong++; //adds one to the song index
    currentSong %= songArray.length; //modulus of song index so it fits within array and loops back once its larger than the array length
    songArray[currentSong].play(); //plays the song at new index
    timeStarted = ms;
  }
}

function autoPlayToggle(){
  if(autoPlay){
    autoPlay = false;
    buttonAutoPlay.html('autoplay off');
  }else{
    autoPlay = true;
    buttonAutoPlay.html('autoplay on');
  }
}

function setup() {
  angleMode(DEGREES);
  let canvas = createCanvas(windowWidth, windowHeight);
  buttonToggle = createButton('pause/play');
  buttonToggle.mousePressed(toggleSong);
  buttonToggle.position(windowWidth*0.015,windowHeight*0.2495);
  buttonSwitch = createButton('cycle through songs');
  buttonSwitch.mousePressed(switchSong);
  buttonSwitch.position(windowWidth*0.015,windowHeight*0.32);
  buttonAutoPlay = createButton('autoplay on');
  buttonAutoPlay.mousePressed(autoPlayToggle);
  buttonAutoPlay.position(windowWidth*0.015,windowHeight*0.3905);
  canvas.position(0,0);
  canvas.style('z-index', '-1');
  fft = new p5.FFT(0.65, range.bins);
  console.log(fft);
  image(backgroundImg, 0, 0);
  frameRate(fps); //attemps to get it to render at 75fps
}

function renderBackground(){
  background(backgroundImg);   
  //image(backgroundImg, -(xBar*bump/20), -(xBar*bump/30), (windowWidth+(xBar*bump/10)), (windowHeight+(xBar*bump/15)));
  image(backgroundImg, -s_shake.xBackground-(windowWidth*zoom)-(xBar*bump/20), -s_shake.yBackground-(windowHeight*zoom)-(xBar*bump/30), (windowWidth*zoom*2)+(windowWidth+(xBar*bump/10)), (windowHeight*zoom*2)+(windowHeight+(xBar*bump/15)));
  darkness += ((0.95-(Math.pow(xBar, 1.5)/20000))-darkness)/10;
  if(darkness >= 0){
    fill(`rgba(0,0,0,${darkness})`);
  }else{
    console.log(darkness);
    fill(`rgba(255,255,255,${-darkness})`);
  }
  rect(0,0,windowWidth,windowHeight);
}

function s_shakeOffset(){
  s_shake.amplitude += ((s_shake.ampReactivity*Math.pow(xBar, 2.5))-s_shake.amplitude)/s_shake.smoothing; //amplitude of vibration increases with xbar
  s_shake.freq += ((xBar*s_shake.freqReactivity)-s_shake.freq)/(s_shake.smoothing*5); //freqency increases with xbar
  s_shake.offset += ((xBar/100)-s_shake.offset)/(s_shake.smoothing*15); //vibrates with d xbar

  let seed;
  let amp;

  if(isDropped(songArray[currentSong].currentTime())){
    amp = s_shake.amplitude * drop.gain;
    seed = ((ms/1000)+s_shake.offset)*s_shake.freq;
  }else{
    amp = s_shake.amplitude;
    seed = ((ms/1000)+(s_shake.offset/10))*s_shake.freq;
  }

  s_shake.x += (size*amp*Math.sin(seed*1.3)-s_shake.x)/(s_shake.smoothing-(xBar/100));
  s_shake.y += (size*amp*Math.cos(seed*1.25)-s_shake.y)/(s_shake.smoothing-(xBar/100));
  s_shake.xBackground += ((0.2*amp*Math.sin(seed/10))-s_shake.xBackground)/(s_shake.smoothing-(xBar/100));
  s_shake.yBackground += ((0.2*amp*Math.cos(seed/10))-s_shake.yBackground)/(s_shake.smoothing-(xBar/100));
}

function isDropped(time){ //bass is dropped?
  for(let i = 0; i < drop.times.length; i++){
    if((drop.times[i][0] <= time)&&(drop.times[i][1] >= time)){return true;}
  }
  return false;
}

function visualizer(){
  renderBackground();
  s_shakeOffset();
  spectrum = fft.analyze();
  let cutoff = Math.round((range.end/22000)*range.bins); //last array index in the bins array the audio visualiser needs to produce graph with given range data
  spectrum.splice(cutoff, range.bins-(cutoff));
  translate(windowWidth/2, windowHeight/2);
  let iterations = spectrum.length;
  let sumX = 0;
  let i;
  angleOffset = -45;//(135+(Math.pow(xBar, 1.3)/50)-angleOffset)/15;
  innerRadius += ((size*(windowHeight/1440)*Math.pow(xBar, 2.55)/75550)-innerRadius)/4; //increase the power to increase the OOMPH that the center ball reacts with
  let amplitude;
  for(i = 0; i < iterations; i++){
    if(isDropped(songArray[currentSong].currentTime())){
      amplitude = size*((windowHeight/1440)*0.000235*((xBar/700)+0.1)*Math.pow(spectrum[i]*2, 2.5));
    }else{
      amplitude = size*((windowHeight/1440)*0.000135*((xBar/700)+0.1)*Math.pow(spectrum[i]*2, 2.5));
    }
    sumX += (Math.pow(spectrum[i], 1.1)/(Math.pow(i+1, 0.75)))*(iterations-(i))*(150/(range.end)); //bass weighted average volume
    if(amplitude >= 0){ //optimisation: only draws lines viewer can see (doesnt bother with ones hidden behind logo)
      let radius = map(amplitude, 0, 256, 100, 200);
      let x1 = 0;
      let y1 = 0;
      let x = (radius+25+innerRadius) * cos(angleOffset+(180/iterations)*i);
      let y = (radius+25+innerRadius) * sin(angleOffset+(180/iterations)*i);
      if(rainbowDisplay){
        let index = (i+offset)%iterations; //mod allows loopback
        //stroke((255 - (index*2.9)+Math.pow(index/35,4)), (((index*2.9)-Math.pow(index/6,2))*3), ((index*5.8) - 255)-Math.pow(index/34,4));
        let n = (561.66/range.end)*index;
        let r = Math.round((Math.pow(((1.45*n)-40), 2)/5.5)-10*((1.45*n)-40));
        let g = Math.round(18*((1.9*n)-10)-(Math.pow(((1.9*n)-10),2)/6)); 
        let b = Math.round(10.5*((1.9*n)-65)-(Math.pow(((1.9*n)-65),2)/11.5))
        stroke(r,g,b)
      }else{stroke(255);}
      /*
      the maths is a good estimation of the full colourwheel using a lot of trial and error in desmos
      */
      strokeWeight((((windowHeight/46000)*(250+(innerRadius))+(amplitude/100)+1)*300)/range.end);
      line(x1+s_shake.x, y1+s_shake.y, x+s_shake.x, y+s_shake.y);

      x = (radius+25+innerRadius) * cos(angleOffset-((180/iterations)*(i+1)));
      y = (radius+25+innerRadius) * sin(angleOffset-((180/iterations)*(i+1)));
      line(x1+s_shake.x, y1+s_shake.y, x+s_shake.x, y+s_shake.y);
    }
  }
  if(isDropped(songArray[currentSong].currentTime())){xBar = Math.pow((sumX/iterations),1.1)/1.6;}else{xBar = (sumX/iterations)/1.2;}
  offset += (((xBar/10)+ms/100)-offset)/10;
  if(circleDisplay){renderCircle();}
  if(document.getElementById('custom-button').style.display == "none"){image(logoImg, -125-(innerRadius)+(s_shake.x), (s_shake.y)-125-(innerRadius), (250+innerRadius*2), 250+innerRadius*2);}
}


function renderCircle(){
  let radius = size*235*(windowHeight/1000);
  strokeWeight((windowHeight/1440)*((radius+Math.pow(xBar,1.2))/100));
  colourGlide();
  stroke(`rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},0.75)`);
  fill((Math.pow(xBar, 1.2)/20)+50, (Math.pow(xBar, 1.2)/20)+50, (Math.pow(xBar, 1.2)/20)+50);
  circle(0, 0, 0.0295*(windowHeight/1440)*Math.pow(xBar, 1.25)+radius);  
}

function colourGlide(){
  g += (((Math.pow(xBar+2, 1.1)/5-75)%255)-g)/250; //the whole -[varname])/10 allows the value to glide gently from one value to the next 
  b += ((((Math.pow(xBar+2, 1.3)/10)-100)%255)-b)/250;
  r += (((Math.pow(xBar+2, 1.1)/5+75)%255)-r)/250;
}

function loadingCheck(){
  if(soundsToLoad > 0){
    document.querySelector('#custom-button').innerHTML = `requesting file upload... ${soundsToLoad} file(s) left to load`;
    if(songArray[currentSong].isPlaying()){
      songArray[currentSong].pause();
    }
    justFinishedLoading = true;
  }else{
    if(justFinishedLoading){
      currentSong++;
      toggleSong();//resumes playing if files have just been loaded
      justFinishedLoading = false;
    }
    document.querySelector('#custom-button').innerHTML = "upload songs (mp3/wav)";
  }
}

function windowResized() {
  canvas = resizeCanvas(windowWidth, windowHeight);
}

function displayCurrentSong(){
  let fileName = songArray[currentSong].file.name;
  if(songArray[currentSong].file.name){document.getElementById('song-display').innerHTML = fileName.toLowerCase();}else{document.getElementById('song-display').innerHTML =  'Au5 - Interstellar.mp3';}
}

function loadingBar(){
  loadBarWidth += (((windowWidth/numberFilesInput)*soundsToLoad)-loadBarWidth)/1;
  strokeWeight(0);
  fill(150, 50, 50);
  rect(windowWidth/-2,windowHeight/-1.8,loadBarWidth,10);
}

function progressBar(){
  if(!songArray[currentSong].isPaused()){
    if(deadFrames > 10){progressBarWidth += (windowWidth*(songArray[currentSong].currentTime()/songArray[currentSong].duration())-progressBarWidth)/10;} //glides progress bar to position (+=, -property, )/10)
    deadFrames++;
  }
  rectMode(CORNER);
}

function draw() { //basically the mainloop in p5 js i think
  
  ms = millis();
  
  if(((timeStarted >= ms-5000)||(songArray[currentSong].isPaused()==true))&&(warningDisplay)){
    document.getElementById('warning-box').style.display = 'block';
    document.getElementById('title').style.display = 'block';
    fill(0);
    rect(0,0,windowWidth,windowHeight);
    xBar = 0; //stop artifact when warning disappears and the center circle is massive
  }else{
    document.getElementById('warning-box').style.display = 'none';

    visualizer(); //draws the visualizer
        
    if(songArray[currentSong].isPlaying()){progressBar();} //calculates size of progress bar for playing song if song is playing
        
    strokeWeight(0);
    fill(255);
    rect(windowWidth/-2,windowHeight/-2,progressBarWidth,10);

    loadingCheck(); //if loading sounds, to speed up audio decoding the currently playing song will pause

    loadingBar();

    displayCurrentSong(); //does what it says on the tin

    if((songArray[currentSong].isPlaying()==false)&&(songArray[currentSong].isPaused()==false)&&(autoPlay)){
      switchSong();
    }
  }
}
