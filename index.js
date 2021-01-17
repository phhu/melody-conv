//import * as Tone from 'tone';
import './style.css';

//const core2 = require('@magenta/music/node/core');
//const mvae = require('@magenta/music/node/music_vae');
//core2.Recorder
//core2.StaffSVGVisualizer

//create a synth and connect it to the main output (your speakers)

const {MELODY1,TWINKLE_TWINKLE} = require('./melodies');
const {sfPlayer} = require('./sfPiano');
const {recorder} = require('./recorder');
const {sequencesMatch} = require('./compareSequences');
const seq = core.sequences;
/*
// https://tonejs.github.io/examples/polySynth
const synth = new Tone.PolySynth().toDestination();

const makeNoise = () => {
  console.log("makeNoise");
  synth.triggerAttackRelease("C4", "8n"); 
  synth.triggerAttackRelease("E4", "8n"); 
  synth.triggerAttackRelease("G4", "4n"); 
} 
*/

const makeButton = ({
  id,
  parent = "controls",
  type = "button",
  fn = () =>console.log("clicked"),
}={}) => {
  if (type==="br"){
    const br = document.createElement('br');
    document.getElementById(parent).appendChild(br);  
  } else {
    const b = document.createElement('button');
    b.setAttribute('id',id);
    b.innerHTML = id;
    document.getElementById(parent).appendChild(b);
    document.getElementById(id).addEventListener('click',fn);   
  }
}
//control mapping
[
  {parent: "active",  id: "play source", fn: ()=>{playMelody(activeMelody)} },
  {parent: "sample1", id: "play variant 1", fn: ()=>{playMelody(samples[0])} },  
  {parent: "sample2", id: "play variant 2", fn: ()=>{playMelody(samples[1])} },  
  {parent: "sample3", id: "play variant 3", fn: ()=>{playMelody(samples[2])} }, 
  {parent: "active", id: "makeSimilar",  fn: ()=>{ makeSimilar({count:3})(activeMelody) } },  
  {parent: "sample1",id: "choose variant 1", fn: ()=>{chooseMelody(samples[0])} },  
  {parent: "sample2",id: "choose variant 2", fn: ()=>{chooseMelody(samples[1])} },  
  {parent: "sample3",id: "choose variant 3", fn: ()=>{chooseMelody(samples[2])} }, 
  //{id: "start",fn: ()=>Tone.start() },
  //{id: "playMidi",fn: ()=>midiPlayer.start(activeMelody) },
  {parent:"afterRecording",id: "RECORD (midi)",fn: ()=>{
    recorder.callbackObject = null;
    recorder.enablePlayClick(
      document.getElementById("useClick").checked
    );
    recorder.start();
    console.log("recording start"); 
    document.getElementById("RECORD (midi)").style['background-color'] =  'red'
  }},
  {parent:"afterRecording",id: "Stop REC",fn: ()=>{
    let rec = recorder.stop();
    document.getElementById("RECORD (midi)").style['background-color'] =  'inherit'
    console.log("recording stop",rec);
    const stepsPerBeat = 4;
    //const stepsPerBar = 4 * stepsPerBeat;
    const startTime = rec.notes[0] && rec.notes[0].startTime ;
    const endTime = rec.notes[0] && rec.notes[rec.notes.length-1].endTime ;
    rec = seq.trim(rec,startTime,endTime);
    rec = seq.quantizeNoteSequence(rec,stepsPerBeat);
    console.log("recording quantized and trimmed:",rec);
    recording = rec;    
    showRecording(rec);
    testRecordings();
  }},
  {parent:"afterRecording",id:"Play recording",   fn: () => {playMelody(recording);testRecordings();}},
  {parent:"afterRecording",id:"Choose recording", fn: () => {chooseMelody(recording);}},
  //{parent:"afterRecording",id:"testRec",   fn: () => testRecordings()}
  {parent: "active",id:"twinkle",   fn: () => chooseMelody(TWINKLE_TWINKLE)},
  {parent: "active",id:"melody1",   fn: () => chooseMelody(MELODY1)},
].map(makeButton);

let recording;

const setStaffColor = (id,comparison) => {
  const green = "rgba(0, 252, 0, 0.178)";
  const match = sequencesMatch(recording,comparison);
  document.getElementById(id).style['background-color'] = match ? green : 'inherit';
  console.log(id,match);
}

const clearRecordingTest = () => {
  ['staff0','staff1','staff2','staff3']
    .forEach(id => 
      document.getElementById(id).style['background-color'] =  'inherit'
    )
};

const testRecordings = () => {
  if(recording){
    setStaffColor('staff0',activeMelody);
    setStaffColor('staff1',samples[0]);
    setStaffColor('staff2',samples[1]);
    setStaffColor('staff3',samples[2]);
  } else {
    console.log("no recording to test!");
  }
};

const showRecording = (rec) => {
  visualizeMelody({n:"Rec"})(rec);
} 

const src = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small';  // 'data/mel_small'
const model = new music_vae.MusicVAE(src);
const player = new core.Player();    // WithClick
const midiPlayer = new core.MIDIPlayer();
midiPlayer.requestMIDIAccess().then((x) => {
  // For example, use only the first port. If you omit this,
  // a message will be sent to all ports.
  //midiPlayer.outputs = [midiPlayer.availableOutputs[0]];
  midiPlayer.outputs = x;
  midiPlayer.outputChannel = 1;
  //console.log("playing via midi",x,midiPlayer.availableOutputs);
  //midiPlayer.resumeContext();
  //midiPlayer.start(MELODY1).then(()=>console.log("midiPlayer started"));
})


const prepare = Promise.all([
  model.initialize(),
  recorder.initialize(),
  //sfPlayer.loadAllSamples(),
]);

let samples;
let activeMelody;

const log = (msg) => {
  document.getElementById('status').innerHTML = msg;
  console.log(msg);
}

log("preparing. please wait");
prepare.then((_) => {
  log("ready");
  //makeSamples();
  chooseMelody(TWINKLE_TWINKLE);
  sfPlayer.loadAllSamples().then(()=>log("loaded soundfont samples"));
  //chooseMelody(MELODY1);
  //makeSimilar({count:3})(activeMelody)
});

const makeSamples = melody => {
  model.sample(2)
  .then(newSamples => {
    console.log("made samples");
    samples = newSamples;
  });
}

const makeSimilar = ({count=3}={}) => melody => {
  model.similar(melody,count,0.75)
  .then(newMelodies => {
    console.log("made similar",newMelodies);
    samples = newMelodies;
    samples.forEach((s,i)=>visualizeMelody({n:i+1})(s))
  });
}

const playMelody = melody => {
  const players = {
    'MIDI player': midiPlayer,
    'Basic player': player,
    'Soundfont player': sfPlayer,
  }
  const p = players[document.getElementById('player').value] || player;
  p.resumeContext();
  try{p.stop();} catch(e){console.error("couldn't stop",e)}
  //player.start(melody);
  p.start(melody)
  //sfPlayer.start(melody);
  //sfPlayer.start(samples[0]);
  //console.log(samples[0]);
  console.log("playing",melody);
}



const chooseMelody = melody => {
  activeMelody = melody;
  visualizeMelody()(melody);
  makeSimilar()(activeMelody);
  clearRecordingTest();
  return melody;
};
global.chooseMelody = chooseMelody;

let staff;
let roll;
let waterfall;

const visualizeMelody = ({
  scoreDiv="staff",
  rollDiv="roll",
  waterfallDiv="waterfall",
  n="0",
}={}) => melody => {
  //console.log("vis",n)
  staff = new core.StaffSVGVisualizer(melody, document.getElementById(scoreDiv + n ));
  //roll = new core.PianoRollSVGVisualizer(melody, document.getElementById(rollDiv));
  //waterfall = new core.WaterfallSVGVisualizer(melody, document.getElementById(waterfallDiv));
}

