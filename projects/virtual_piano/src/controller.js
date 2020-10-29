export default class Controller{

    constructor(){ //constructs all the data needed  
        this.notes = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.noteArray = ["C1","C#1","D1","D#1","E1","F1","F#1","G1","G#1","A1","A#1","B1","C2","C#2","D2","D#2","E2","F2","F#2","G2","G#2","A2","A#2","B2","C3","C#3","D3","D#3","E3","F3","F#3","G3","G#3","A3","A#3","B3"];
        this.preProgrammedSongs = 0;
        this.startOctaveToggle = 0;
    }

    checkKey(key, polarity){  //takes keycode for switch case, and polarity is either 1 or 0
        switch(key){
            //octave 1

            case 90: //z note(C)
                this.notes[0] = polarity; 
                break;
            case 83: //s (C#)
                this.notes[1] = polarity;  
                break;
            case 88: //x (D)
                this.notes[2] = polarity;
                break;
            case 68: //d (D#)
                this.notes[3] = polarity; 
                break;
            case 67: //c (E)
                this.notes[4] = polarity; 
                break;
            case 86: //v (F)
                this.notes[5] = polarity; 
                break;
            case 71: //g (F#)
                this.notes[6] = polarity;
                break;
            case 66: //b (G)
                this.notes[7] = polarity;
                break;
            case 72: //h (G#)
                this.notes[8] = polarity;
                break;
            case 78: //n (A)
                this.notes[9] = polarity;
                break;
            case 74: //j (A#)
                this.notes[10] = polarity;
                break;
            case 77: //m (B)
                this.notes[11] = polarity;
                break;

            //octave 2

            case 81: //q note(2C)
                this.notes[12] = polarity; 
                break;
            case 50: //2 (2C#)
                this.notes[13] = polarity;  
                break;
            case 87: //w (2D)
                this.notes[14] = polarity;
                break;
            case 51: //3 (2D#)
                this.notes[15] = polarity; 
                break;
            case 69: //e (2E)
                this.notes[16] = polarity; 
                break;
            case 82: //r (2F)
                this.notes[17] = polarity; 
                break;
            case 53: //5 (2F#)
                this.notes[18] = polarity;
                break;
            case 84: //t (2G)
                this.notes[19] = polarity;
                break;
            case 54: //6 (2G#)
                this.notes[20] = polarity;
                break;
            case 89: //y (2A)
                this.notes[21] = polarity;
                break;
            case 55: //7 (2A#)
                this.notes[22] = polarity;
                break;
            case 85: //u (2B)
                this.notes[23] = polarity;
                break;
            
            //preprogrammed song toggle

            case 57: //9
                this.preProgrammedSongs = polarity*1;
                break;
            case 48: //0
                this.preProgrammedSongs = polarity*2;
                break;
            case 173:
                this.startOctaveToggle += polarity;
                break;
            default:
                return;
        }
    }
}

