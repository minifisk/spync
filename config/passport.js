const SpotifyStrategy = require('passport-spotify').Strategy;
const SpotifyWebApi = require('spotify-web-api-node');
const _ = require('underscore');
const {checkUser, checkPreferences, checkArtist, checkTrack, addArtistPreferences, addTrackPreferences, stringGen} = require('./sfunctions');
const tables = require('./tables');

/* PASSPORT STRATEGY FUNCTION TO HANDLE AUTH, 
USER HANDLING AND REGISTRATING USER MUSIC PREFERENCES */

/* Function for retrieving data from spotify passport */
module.exports = function(passport) {
  passport.use(
    new SpotifyStrategy(
      {
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        callbackURL: process.env.SPOTIFY_CALLBACK_URL
      },
      async (accessToken, refreshToken, expires_in, profile, done) => {
      
      /* Declaring user variable to be used to store value from SpotifyStrategy */
      const user = {};

      /* Put the incoming data in an object "aUser" */
      const aUser = Object.create(user);
        aUser.username = profile.username;
        aUser.displayName = profile.displayName;
        aUser.profilePicture = profile.photos[0];
        aUser.email = profile._json.email;
        aUser.contactCode = stringGen(7);
        aUser.accessToken = accessToken;
        aUser.refreshToken = refreshToken;
      
      // NOTE: don't run the code below async - thanks to @blahah

      /* Check if user is in DB, if not, add. Store user_id in "user" for
      using in other calls */

      let user_id = await checkUser(aUser.username, aUser.displayName, aUser.profilePicture, aUser.email, aUser.contactCode);

      /* Check if artistPreferences OR trackPreferences contain row that
      was created 30 days or longer ago. If true, delete all rows
      in both tables and then run code below. If false, return from function */

      let preferencesStatus = await checkPreferences(user_id);
      
      /* If user preferences was older than 30 days and checkPreferences
      deleted the tables, run the folliwing code: */
      if (preferencesStatus === true) {
        
        /* SET UP SPOTIFY API CALL TO GET TOP STATS FROM USER */

        /* Initialize spotifyapi object to prepare to retrieve top songs and artists */
        var spotifyApi = new SpotifyWebApi({
          clientID: process.env.SPOTIFY_CLIENT_ID,
          clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
          callbackURL: process.env.SPOTIFY_CALLBACK_URL
        });

        /* Set accesstoken for api object  */
        spotifyApi.setAccessToken(accessToken);
      
        /* STEP 1: RETRIEVE TOP ARTISTS FOR CURRENT USER */
        await spotifyApi.getMyTopArtists({ limit: 5 })
          .then(function(data) {
            let topArtistsRaw = data.body.items;
          
            /* Map top artists and key data into a new array */
            let mappedArtists = topArtistsRaw.map(artist => {
              return {
              artist: artist.name, 
              popularity: artist.popularity,
              url: artist.external_urls.spotify,
              image: artist.images[0].url
              }
            });

            /* Map through each favorite artist of the user from the array */
            mappedArtists.map(async artist => {
              let a_artist = artist.artist;
              let a_popularity = artist.popularity;
              let a_url = artist.url;
              let a_image = artist.image;

              /* Check if artist is in the general artist-table, if not add it.
              Then store the returning artist_id in artist_id */
              let artist_id = await checkArtist(a_artist, a_url, a_popularity, a_image);

              // Add the artist to current users artistPreferences table
              await addArtistPreferences(user_id, artist_id);
            });
          });

        /* STEP 2: RETRIEVE TOP TRACKS FOR CURRENT USER */
        await spotifyApi.getMyTopTracks({ limit: 2 })
          .then(function(data) {
            let topTracksRaw = data.body.items;

            /* Map key data for each track into new array */
            let mappedTracks = topTracksRaw.map(track => {
              return {
              trackname: track.name, 
              artist: track.artists[0].name,
              popularity: track.popularity,
              url: track.external_urls.spotify
              }
            });

            /* Check if each track is in the DB, if not add the track to DB */
            mappedTracks.map(async track => {
              let a_track = track.trackname;
              let a_artist = track.artist;
              let a_url = track.url;
              let a_popularity = track.popularity;
            
              /* Check if current track is in the collective artist/track DB
              Store the reeturning track_id in variable */
              let track_id = await checkTrack(a_track, a_artist, a_url, a_popularity);
        
              /* Add the user trackPreferences to DB's */
              await addTrackPreferences(user_id, track_id, a_artist);
            });
          });
        }
        /* Reach this at the end of updating DB or directly if the user
        preferences are up to date */
        return done(null, profile);
      }     
    )
  );

  /* Serialize user to be used in sessions */
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

}
