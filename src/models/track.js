const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  duration_ms: {
    type: Number,
    required: true
  },
  hrefs: {
    spotify: String,
    deezer: String,
  },
  previews: {
    spotify: String,
    deezer: String,
  },
  uids: {
    spotify: String,
    deezer: String,
  },
  album_name: {
    type: String,
    required: true
  },
  album_mongo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  },
});

module.exports = mongoose.model('Track', trackSchema);
