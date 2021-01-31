import './style.css';

const {MELODY1,MELODY2} = require('./melodies');
const {sfPlayer} = require('./sfPiano');
const seq = core.sequences;

const makeButton = ({
  id,
  parent = "controls",
  type = "button",
  fn = ()=> () =>console.log("clicked"),
}={}) => {
  const b = document.createElement('button');
  b.setAttribute('id',id);
  b.innerHTML = id;
  document.getElementById(parent).appendChild(b);
  console.log("adding Click",id,fn,document.getElementById(id));
  document.getElementById(id).addEventListener('click',fn());
}

//control mapping
const buttonSpecs = [
  {parent: "melody1",  id: "play1", fn: ()=>()=>{playMelody(MELODY1)} },
  {parent: "melody2",  id: "play2", fn: ()=>()=>{playMelody(MELODY2)} },
  {parent: "controls",  id: "inter", fn: ()=>()=>{reinterpolate() }   },
];
buttonSpecs.map(makeButton);


const src = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small';  // 'data/mel_small'
const model = new music_vae.MusicVAE(src);
const player = new core.Player();    // WithClick
const midiPlayer = new core.MIDIPlayer();
midiPlayer.requestMIDIAccess().then((x) => {
  midiPlayer.outputs = x;
  midiPlayer.outputChannel = 1;
})

const prepare = Promise.all([
  model.initialize(),
  //recorder.initialize(),
  //sfPlayer.loadAllSamples(),
]);

global.samples = [];
//let melodies = [];

const log = (msg) => {
  document.getElementById('status').innerHTML = msg;
  console.log(msg);
}

log("preparing. please wait");
prepare.then((_) => {
  log("ready");
  //makeSamples();
  setupMelodies(MELODY1,MELODY2);
  //sfPlayer.loadAllSamples().then(()=>log("loaded soundfont samples"));
  //chooseMelody(MELODY1);
  //makeSimilar({count:3})(activeMelody)
});

const getInterpolationCount = () => 10;


const reinterpolate = () => {
  console.log("reinterpolating");
  interpolateMelodies()(MELODY1,MELODY2);
}
global.reinterpolate = reinterpolate;

const interpolateMelodies = ({
  count=3
}={}) => (mel1,mel2) => {
  /* interpolate(
      inputSequences: INoteSequence[], 
      numInterps: number | number[], 
      temperature?: number, 
      controlArgs?: MusicVAEControlArgs
    ): Promise<INoteSequence[]>
  */
  model.interpolate([mel1,mel2],getInterpolationCount(),0.5)
  .then(newMelodies => {
    console.log("interpolated:",newMelodies);
    global.samples = newMelodies;
    const d = document.getElementById("interpolatedMelodies")
    d.innerHTML="";
    global.samples.forEach((s,i)=>{
      d.innerHTML+=`<div id="staffInt${i}"></div>`;
      d.innerHTML+=`<button id="buttonInt${i}" onclick="console.log('playing Int${i}');playMelody(samples[${i}]);">Play Int ${i}</button>`;
      visualizeMelody({scoreDiv:"staffInt",n:i})(s);
      /*makeButton({
        id: `Play_Int_${i}`,
        parent: `staffInt${i}`,
        fn: (() => () => {log("clicked "+ i)}),
      });*/
    });
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
global.playMelody = playMelody;

const setupMelodies = (mel1,mel2) => {
  visualizeMelody({scoreDiv:'staffMelody',n:1})(mel1);
  visualizeMelody({scoreDiv:'staffMelody',n:2})(mel2);
  interpolateMelodies()(mel1,mel2);
  //return melody;
};

const visualizeMelody = ({
  scoreDiv="staff",
  rollDiv="roll",
  waterfallDiv="waterfall",
  n="0",
}={}) => melody => { 
  console.log("vis",n)
  const staff = new core.StaffSVGVisualizer(melody, document.getElementById(scoreDiv + n ));
  //const roll = new core.PianoRollSVGVisualizer(melody, document.getElementById(rollDiv));
  //const waterfall = new core.WaterfallSVGVisualizer(melody, document.getElementById(waterfallDiv));
}

