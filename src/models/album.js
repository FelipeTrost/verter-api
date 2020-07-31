const mongoose = require("mongoose");

const albumSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    album_type: {
        type: String,
        required: true
    },
    images: [{
        height: Number,
        width: Number,
        url: String
    }],
    hrefs: {
        spotify: String,
        deezer: String,
    },
    uids: {
        spotify: String,
        deezer: String,
    },
    release_date: {
        type: Date,
        required: true
    },
    total_tracks: {
        type: Number,
        required: true
    },
    tracks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track'
    }],
})

module.exports = mongoose.model("Album", albumSchema);