//import * as Tone from 'tone';
//import './style.css';

//const core2 = require('@magenta/music/node/core');
//const mvae = require('@magenta/music/node/music_vae');
//core2.Recorder

//create a synth and connect it to the main output (your speakers)

const {MELODY1} = require('./melodies');
const {sfPlayer} = require('./sfPiano');
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

/*
//control mapping
[
  {id: "#play", fn: makeNoise },
  {id: "#start",fn: ()=>Tone.start() },
].map(x =>
  document.querySelector(x.id).addEventListener('click',x.fn)
)
*/
/*
new musicvae.MusicVAE('./data/mel_small')
    .initialize()
    .then(function(musicVAE) {
        //blends between the given two melodies and returns numInterpolations note sequences
        // MELODY1 = musicVAE.sample(1, 0.5)[0]; //generates 1 new melody with 0.5 temperature. More temp means crazier melodies
        return musicVAE.interpolate([MELODY1, MELODY2], numInterpolations);
    })
    .then(function(noteSequences) {
        var text = 'Click to Play a blend from Melody 1 to Melody 2 in ' + numInterpolations + ' interpolations';
        document.querySelector('.loading').innerHTML = text;
        interpolatedNoteSequences = noteSequences;
    });
*/
// Your code:
const src = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small';  // 'data/mel_small'
const model = new music_vae.MusicVAE(src);
const player = new core.Player();

model
  .initialize()
  .then(() => model.sample(2))
  .then(samples => {
    player.resumeContext();
    player.start(MELODY1);
    //sfPlayer.start(samples[0]);
    console.log(samples[0]);
    console.log(MELODY1);
  });

//play a middle 'C' for the duration of an 8th note
