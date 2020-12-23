export default class SoundHandler{

    constructor(){

        this.notes = [
            new Audio("./lib/C1.wav"), //octave 1
            new Audio("./lib/Cs1.wav"),
            new Audio("./lib/D1.wav"),
            new Audio("./lib/Ds1.wav"),
            new Audio("./lib/E1.wav"),
            new Audio("./lib/F1.wav"),
            new Audio("./lib/Fs1.wav"),
            new Audio("./lib/G1.wav"),
            new Audio("./lib/Gs1.wav"),
            new Audio("./lib/A1.wav"),
            new Audio("./lib/As1.wav"),
            new Audio("./lib/B1.wav"),
            new Audio("./lib/C2.wav"), //octave 2
            new Audio("./lib/Cs2.wav"),
            new Audio("./lib/D2.wav"),
            new Audio("./lib/Ds2.wav"),
            new Audio("./lib/E2.wav"),
            new Audio("./lib/F2.wav"),
            new Audio("./lib/Fs2.wav"),
            new Audio("./lib/G2.wav"),
            new Audio("./lib/Gs2.wav"),
            new Audio("./lib/A2.wav"),
            new Audio("./lib/As2.wav"),
            new Audio("./lib/B2.wav"),
            new Audio("./lib/C3.wav"), //octave 3
            new Audio("./lib/Cs3.wav"),
            new Audio("./lib/D3.wav"),
            new Audio("./lib/Ds3.wav"),
            new Audio("./lib/E3.wav"),
            new Audio("./lib/F3.wav"),
            new Audio("./lib/Fs3.wav"),
            new Audio("./lib/G3.wav"),
            new Audio("./lib/Gs3.wav"),
            new Audio("./lib/A3.wav"),
            new Audio("./lib/As3.wav"),
            new Audio("./lib/B3.wav"),
        ];
        this.pressed = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    }

    play(controller){
        let offset = (controller.startOctaveToggle%2)*12;

        for(let i = 0; i < controller.notes.length; i++){
            if(controller.notes[i] == 1){
                if(this.pressed[i+offset] == false){
                    this.notes[i+offset].currentTime = 0.05;
                    this.pressed[i+offset] = true;
                }
                this.notes[i+offset].playbackRate = 1;
                this.notes[i+offset].play();
            }else if(controller.notes[i+offset] == 0){
                this.pressed[i+offset] = false;
                this.notes[i+offset].playbackRate = 3;
            }
        }
    }
}