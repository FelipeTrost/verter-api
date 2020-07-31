const spotify = require('./spotify.js');

// The plan is to get all the info from spotify
// Then we complete with the other APIs

const getAllData = (spotifyWebApi) => {
  spotify(spotifyWebApi);
};

module.exports = getAllData;
