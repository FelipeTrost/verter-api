const spotify = require('./spotify.js');
const deezer = require('./deezer.js');

// The plan is to get all the info from spotify
// Then we complete with the other APIs

const getAllData = async (spotifyWebApi) => {
  console.log('Fetching data');

  console.log('Fetching from Spotify');
  await spotify(spotifyWebApi);

  console.log('Fetching from Deezer');
  await deezer();

  console.log('Done fetching data');
};

module.exports = getAllData;
