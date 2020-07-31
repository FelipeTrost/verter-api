const axios = require('axios');
const Album = require('../models/album.js');
const Track = require('../models/track.js');
const { get } = require('mongoose');

const getData = async () => {
    try {
        const response = await axios.get(`https://api.deezer.com/artist/14379707/albums`);
        const data = response.data.data;
        
        for(let album of data){
            const {title, link, id} = album;
            const presence = await Album.findOne({name: title});

            if(!presence.uids.deezer) presence.uids.deezer = id;
            if(!presence.hrefs.deezer) presence.hrefs.deezer = link;
            
            const responseTracks = await axios.get(`https://api.deezer.com/album/${id}/tracks`);
            const tracks = responseTracks.data.data;

            for(let track of tracks){
                const {title, link, id, preview} = track;
                const savedTrack = await Track.findOne({album_mongo_id: presence._id, name:title});

                if(!savedTrack) throw new Error("Fatal error, no track found");

                if(!savedTrack.hrefs.deezer) savedTrack.hrefs.deezer = link;
                if(!savedTrack.previews.deezer) savedTrack.previews.deezer = preview;
                if(!savedTrack.uids.deezer) savedTrack.uids.deezer = id;

                await savedTrack.save()
            }

            await presence.save()
        }
    } catch (error) {
        console.error("fff", error);
    }

}

module.exports = getData;