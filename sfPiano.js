  const baseUrl = 'https://storage.googleapis.com/magentadata/js/soundfonts/';

  const sfPlayer = new core.SoundFontPlayer(baseUrl + 'salamander');
  //sfPlayer.loadAllSamples();


  module.exports = {
    sfPlayer
  };