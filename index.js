//import * as Tone from 'tone';
//import './style.css';

//const core2 = require('@magenta/music/node/core');
//const mvae = require('@magenta/music/node/music_vae');
//core2.Recorder
//core2.StaffSVGVisualizer

//create a synth and connect it to the main output (your speakers)

const {MELODY1} = require('./melodies');
const {sfPlayer} = require('./sfPiano');
const {recorder} = require('./recorder');
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
  type = "button",
  fn = () =>console.log("clicked"),
}={}) => {
  if (type==="br"){
    const br = document.createElement('br');
    document.querySelector('#controls').appendChild(br);  
  } else {
    const b = document.createElement('button');
    b.setAttribute('id',id);
    b.innerHTML = id;
    document.querySelector('#controls').appendChild(b);
    document.getElementById(id).addEventListener('click',fn);   
  }
}
//control mapping
[
  {id: "play melody1", fn: ()=>{playMelody(activeMelody)} },
  {id: "play sample1", fn: ()=>{playMelody(samples[0])} },  
  {id: "play sample2", fn: ()=>{playMelody(samples[1])} },  
  {id: "play sample3", fn: ()=>{playMelody(samples[2])} }, 
  {type:"br"},
  {id: "makeSimilar",  fn: ()=>{ makeSimilar({count:3})(activeMelody) } },  
  {id: "choose1", fn: ()=>{chooseMelody(samples[0])} },  
  {id: "choose2", fn: ()=>{chooseMelody(samples[1])} },  
  {id: "choose3", fn: ()=>{chooseMelody(samples[2])} }, 
  {type:"br"}, 
  //{id: "start",fn: ()=>Tone.start() },
  //{id: "playMidi",fn: ()=>midiPlayer.start(activeMelody) },
  {id: "recStart",fn: ()=>{
    recorder.callbackObject = null;
    recorder.start();
    console.log("recording start"); 
  }},
  {id: "recStop",fn: ()=>{
    let rec = recorder.stop();
    console.log("recording stop",rec);
    const stepsPerBeat = 4;
    //const stepsPerBar = 4 * stepsPerBeat;
    const startTime = rec.notes[0] && rec.notes[0].startTime ;
    const endTime = rec.notes[0] && rec.notes[rec.notes.length-1].endTime ;
    rec = seq.trim(rec,startTime,endTime);
    rec = seq.quantizeNoteSequence(rec,stepsPerBeat);
    console.log("recording fixed",rec);
    recording = rec;    
    showRecording(rec);
  }},
  {id:"chooseRec", fn: () => {chooseMelody(recording);}},
  {id:"playRec",   fn: () => {playMelody(recording);}},
].map(makeButton);

let recording;

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

console.log("preparing");
prepare.then((_) => {
  console.log("prepared");
  //makeSamples();
  chooseMelody(MELODY1);
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
  const p = midiPlayer;
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
  return melody;
};

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

