const getData = require('./get-data');

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

// -------------------------------
// Connect to mongodb DB
require('./setup/mongodb.js')();

// -------------------------------
// Setup spotify
let spotifyApi;
require('./setup/spotify.js')()
.then(api =>{
  spotifyApi = api;
  setInterval(() => {
    getData(api);
  }, 10*1000*60);
})

// -------------------------------
// Setup express

const api = require('./api');
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
