const express = require('express');

const Album = require('../models/album.js');
const Track = require('../models/track.js');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Hello 🌏 - API'
  });
});

router.get('/albums', async (req, res) => {
  const albums = await Album.find();
  res.json({albums});
});


router.get('/album/:name', async (req, res) => {
  const album = await Album.findOne({name: req.params.name}).populate("tracks");
  res.json({album});
});


router.get('/tracks', async (req, res) => {
  const tracks = await Track.find();
  res.json({tracks});
});


router.get('/track/:name', async (req, res) => {
  const track = await Track.findOne({name: req.params.name});
  res.json({track});
});


router.get('/all', async (req, res) => {
  const albums = await Album.find().populate("tracks");
  res.json({albums});
});


module.exports = router;
