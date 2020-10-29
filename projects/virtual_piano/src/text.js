export default class Text{//exports the class for use in game.js

    constructor(x, y, size, typeface, colour, alignment, controller){
        
        this.position = {
            x: x,
            y: y
        }
        this.size = size;
        this.typeface = typeface;
        this.colour = colour;
        this.alignment = alignment;
        this.notes = controller.noteArray;
    }

    update(canvas){
        this.position.x = canvas.width/2;
        this.position.y = canvas.height/2;
    }

    draw(ctx, controller){
        let offset = (controller.startOctaveToggle%2)*12;

        ctx.fillStyle = this.colour;
        ctx.textAlign = this.alignment;
        let noteText = "";
        for (let i = 0; i < this.notes.length; i++){
            if (controller.notes[i] == 1){
                noteText += "["+this.notes[i+offset]+"]";
            }
        }
        ctx.font = this.size+"px "+this.typeface;
        ctx.fillText(noteText, this.position.x, this.position.y);
    }
} 