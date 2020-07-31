const Album = require('../models/album.js');
const Track = require('../models/track.js');

const getData = async (spotifyWebApi) => {
    try {
        // TODO: if the amount of albums exceeds the limit we don't get all the information available
        const response = await spotifyWebApi.getArtistAlbums(process.env.SPOTIFY_UID, {limit: 50});
        const albums = response.body.items;
        
        for (let album of albums) {

            const {name, album_type, images, external_urls, release_date, total_tracks, id} = album;
        
            const presence = await Album.findOne({name});

            if (presence) {
                if(!presence.album_type) presence.album_type = album_type;
                if(!presence.hrefs.spotify) presence.hrefs.spotify = external_urls.spotify;
                if(!presence.uids.spotify) presence.uids.spotify = id;

                await presence.save();

                // TODO: check tracks + add track if it doesn't exist
                const response = await spotifyWebApi.getAlbumTracks(presence.uids.spotify);
                const tracks = response.body.items
                
                for(let track of tracks){
                    const {name, external_urls, preview_url, id} = track;

                    const trackPresence = await Track.findOne({album_mongo_id: presence._id, name});
                    
                    if(!trackPresence) throw new Error("Fatal error: No track found for album.");

                    if(!trackPresence.hrefs.spotify) trackPresence.hrefs.spotify = external_urls.spotify
                    if(!trackPresence.previews.spotify) trackPresence.previews.spotify = preview_url
                    if(!trackPresence.uids.spotify) trackPresence.uids.spotify = id

                    await trackPresence.save();
                }

            } else {
                const newAlbum = new Album({
                    name,
                    album_type,
                    images,
                    hrefs: {
                        spotify: external_urls.spotify
                    },
                    release_date,
                    total_tracks,
                    uids: {
                        spotify: id
                    },
                    tracks: []
                });

                const response = await spotifyWebApi.getAlbumTracks(id);
                const tracks = response.body.items;

                for (const track of tracks) {
                    const {name, duration_ms, external_urls, preview_url, id} = track;

                    const newTrack = new Track({
                        name,
                        duration_ms,
                        hrefs: {
                            spotify: external_urls.spotify
                        },
                        previews: {
                            spotify: preview_url
                        },
                        uids: {
                            spotify: id
                        },
                        album_name: newAlbum.name,
                        album_mongo_id: newAlbum._id
                    });

                    await newTrack.save();
                    newAlbum.tracks.push(newTrack._id);
                }

                await newAlbum.save();
            }
        }

        console.log('Done checking spotify');
    } catch (error) {
        console.error(error);
    }
};

module.exports = getData;