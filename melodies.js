var everyNote = 'C,C#,D,D#,E,F,F#,G,G#,A,A#,B,'.repeat(20).split(',').map( function(x,i) {
  return x + '' + Math.floor(i/12);
});

//returns the midi pitch value for the given note.
//returns -1 if not found
function toMidi(note) {
  return everyNote.indexOf(note);
}


const MELODY2 = { 
  totalQuantizedSteps: 32,
  quantizationInfo:{stepsPerQuarter: 4},
  notes: [
    {pitch: toMidi('A3'), quantizedStartStep: 0, quantizedEndStep: 4},
    //{pitch: toMidi('C3'), quantizedStartStep: 0, quantizedEndStep: 32},
    {pitch: toMidi('D4'), quantizedStartStep: 4, quantizedEndStep: 6},
    {pitch: toMidi('E4'), quantizedStartStep: 6, quantizedEndStep: 8},
    {pitch: toMidi('F4'), quantizedStartStep: 8, quantizedEndStep: 10},
    {pitch: toMidi('D4'), quantizedStartStep: 10, quantizedEndStep: 12},
    {pitch: toMidi('E4'), quantizedStartStep: 12, quantizedEndStep: 16},
    {pitch: toMidi('C4'), quantizedStartStep: 16, quantizedEndStep: 20},
    {pitch: toMidi('D4'), quantizedStartStep: 20, quantizedEndStep: 26},
    {pitch: toMidi('A3'), quantizedStartStep: 26, quantizedEndStep: 28},
    {pitch: toMidi('A3'), quantizedStartStep: 28, quantizedEndStep: 32}
  ]
};

const LT = { 
  totalQuantizedSteps: 62,
  quantizationInfo:{stepsPerQuarter: 4},
  notes: [
    {pitch: toMidi('A3'), quantizedStartStep: 0, quantizedEndStep: 4},
    //{pitch: toMidi('C3'), quantizedStartStep: 0, quantizedEndStep: 32},
    {pitch: toMidi('D4'), quantizedStartStep: 4, quantizedEndStep: 6},
    {pitch: toMidi('E4'), quantizedStartStep: 6, quantizedEndStep: 8},
    {pitch: toMidi('F4'), quantizedStartStep: 8, quantizedEndStep: 10},
    {pitch: toMidi('D4'), quantizedStartStep: 10, quantizedEndStep: 12},
    {pitch: toMidi('E4'), quantizedStartStep: 12, quantizedEndStep: 16},
    {pitch: toMidi('C4'), quantizedStartStep: 16, quantizedEndStep: 20},
    {pitch: toMidi('D4'), quantizedStartStep: 20, quantizedEndStep: 26},
    {pitch: toMidi('A3'), quantizedStartStep: 26, quantizedEndStep: 28},
    {pitch: toMidi('A3'), quantizedStartStep: 28, quantizedEndStep: 32}
  ]
};



const s = 16;
const MELODY1 = { 
  totalQuantizedSteps: 32,
  quantizationInfo:{stepsPerQuarter: 4},
  notes: [
    {pitch: 60, quantizedStartStep: 0, quantizedEndStep: 2},
    {pitch: 60, quantizedStartStep: 2, quantizedEndStep: 4},
    {pitch: 60, quantizedStartStep: 4, quantizedEndStep: 6},
    {pitch: 60, quantizedStartStep: 6, quantizedEndStep: 7},
    {pitch: 60, quantizedStartStep: 7, quantizedEndStep: 8},
    {pitch: 60, quantizedStartStep: 8, quantizedEndStep: 10},
    {pitch: 55, quantizedStartStep: 10, quantizedEndStep: 12},

    {pitch: 60, quantizedStartStep: s+0, quantizedEndStep: s+2},
    {pitch: 60, quantizedStartStep: s+2, quantizedEndStep: s+4},
    {pitch: 60, quantizedStartStep: s+4, quantizedEndStep: s+6},
    {pitch: 60, quantizedStartStep: s+6, quantizedEndStep: s+7},
    {pitch: 60, quantizedStartStep: s+7, quantizedEndStep: s+8},
    {pitch: 60, quantizedStartStep: s+8, quantizedEndStep: s+10},
    {pitch: 55, quantizedStartStep: s+10, quantizedEndStep: s+12},
  ]
};

const MELODY3 = {
  totalQuantizedSteps: 32,
  quantizationInfo:{stepsPerQuarter: 4},
  notes: [
    {pitch: 60, quantizedStartStep: 0, quantizedEndStep: 2},
    {pitch: 60, quantizedStartStep: 2, quantizedEndStep: 4},
    {pitch: 67, quantizedStartStep: 4, quantizedEndStep: 6},
    {pitch: 67, quantizedStartStep: 6, quantizedEndStep: 8},
    {pitch: 69, quantizedStartStep: 8, quantizedEndStep: 10},
    {pitch: 69, quantizedStartStep: 10, quantizedEndStep: 12},
    {pitch: 67, quantizedStartStep: 12, quantizedEndStep: 16},

    {pitch: 65, quantizedStartStep: 16, quantizedEndStep: 18},
    {pitch: 65, quantizedStartStep: 18, quantizedEndStep: 20},
    {pitch: 64, quantizedStartStep: 20, quantizedEndStep: 22},
    {pitch: 64, quantizedStartStep: 22, quantizedEndStep: 24},
    {pitch: 62, quantizedStartStep: 24, quantizedEndStep: 26},
    {pitch: 62, quantizedStartStep: 26, quantizedEndStep: 28},
    {pitch: 60, quantizedStartStep: 28, quantizedEndStep: 32},  
  ],
};


module.exports = {
  MELODY1, 
  MELODY2,
};