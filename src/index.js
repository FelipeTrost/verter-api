const SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

// -------------------------------
// Setup spotify

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});


spotifyApi.clientCredentialsGrant()
  .then(data => {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(err => {
    console.log(
      'Something went wrong when retrieving an access token',
      err.message
    );
  })



// -------------------------------
// Setup express

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.json({
    message: '🌈✨Hi from verter music✨🌈'
  });
});

app.use('/api/', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// -------------------------------
// Run server

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});