const SpotifyWebApi = require('spotify-web-api-node');

const mongoose = require('mongoose');

const getData = require('./get-data');

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

// -------------------------------
// Connect to mongodb DB
mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to mongodb'))
  .catch((err) => console.log("Couldn't connect to mongodb", err));

// -------------------------------
// Setup spotify

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

spotifyApi.clientCredentialsGrant()
  .then((data) => {
    // console.log(`The access token expires in ${data.body.expires_in}`);
    // console.log(`The access token is ${data.body.access_token}`);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body.access_token);

    try {
      getData(spotifyApi);
    } catch (error) {
      console.error(error);
    }
  })
  .catch((err) => {
    console.log(
      'Something went wrong when retrieving an access token',
      err.message
    );
  });

// -------------------------------
// Setup express

const {
  response
} = require('express');
const api = require('./api');
const Album = require('./models/album.js');
const middlewares = require('./middlewares');

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
