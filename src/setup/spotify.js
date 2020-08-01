const SpotifyWebApi = require('spotify-web-api-node');

module.exports = async () => {
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: process.env.SPOTIFY_REDIRECT_URI
    });

    try {
        const data = await spotifyApi.clientCredentialsGrant()
        spotifyApi.setAccessToken(data.body.access_token);
        return spotifyApi
    } catch (error) {
        console.log(err.message);
        return new Error("Couldn't get access token from spotify")
    }
}
  