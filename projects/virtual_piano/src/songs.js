export default class Songs{
    
    constructor(){
        this.rolls = [ //array full of roll objects
            { 
                speed: 8, //ticks per second
                notes: [ //big 2d array with all dem notes
                    [0],[],[1],[],[2],[],[3],[],[4],[],[5],[],[6],[],[7],[],[8],[],[9],[],[10],[],[11],[],
                    [12],[],[13],[],[14],[],[15],[],[16],[],[17],[],[18],[],[19],[],[20],[],[21],[],[22],[],[23],[],
                    [24],[],[25],[],[26],[],[27],[],[28],[],[29],[],[30],[],[31],[],[32],[],[33],[],[34],[],[35],[]
                ]
            },
            {
                speed: 10, //ticks per second
                notes: [ //big 2d array with all dem notes
                    [14],[],[14],[],[26],[26],[],[],[21],[21],[],[],[],[],[20],[],[],[],[19],[],[],[],[17],[17],[17],[],[14],[],[17],[],[19],[], //32 1/8th beats per 4 beat bar
                    [12],[],[12],[],[26],[26],[],[],[21],[21],[],[],[],[],[20],[],[],[],[19],[],[],[],[17],[17],[17],[],[14],[],[17],[],[19],[], 
                    [0],[],[0],[],[14],[14],[],[],[9],[9],[],[],[],[],[8],[],[],[],[7],[],[],[],[5],[5],[5],[],[2],[],[5],[],[7],[],
                ]   
            }
        ];
        this.startTime = 0;
        this.started = false;
    }

    update(timestamp, index){
        let tempArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //array that once modified, will be returned at the end 
        if(this.started == false){ //starts at the beginning every time :sunglasses:
            this.startTime = timestamp;
            this.started = true;
        }

        let notesPlayingArrayIndex = Math.floor((timestamp-this.startTime)/(1000/this.rolls[index].speed))%this.rolls[index].notes.length; //selects line of the array to play at a given time
        
        for(let i = 0; i < this.rolls[index].notes[notesPlayingArrayIndex].length; i++){
            tempArray[this.rolls[index].notes[notesPlayingArrayIndex][i]] = 1;//turns the two note indexes into an array of note polarities the 'engine' can understand
        }

        return tempArray;
    }

}