const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const pool = require('../config/db');

// @Desc    Login/Landing page
// @route    GET / 
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @Desc    Dashboard 
// @route    GET /dashboard 
router.get('/dashboard', ensureAuth, async (req, res) => {


        // Get a collection of a users favorite artist_id's 
        async function getArtistIdCollection (user_id) {
            return artist_ids = await pool.query('SELECT artist_id from artistPreferences WHERE user_id = ?', [user_id]);
        }

        // Get a collection of a users favorite tracks's 
        async function getTrackIdCollection (user_id) {
            return track_ids = await pool.query('SELECT track_id from trackPreferences WHERE user_id = ?', [user_id]);
        }

        // Get the data about a specific artist
        async function getArtistInfo (artist_id) {
            return artistInfo = await pool.query('SELECT artist_name, artist_image, artist_url from artists WHERE artist_id = ?', [artist_id]);
        }

        // Get the data about a specific track
        async function getTrackInfo (track_id) {
            return trackInfo = await pool.query('SELECT track_name, track_artist, track_url, track_popularity from tracks WHERE track_id = ?', [track_id]);
        }

        // Create an structured ArtistObject 
        function getArtistObject (artistInfo) {
            const artist = {};
            const thisArtist = Object.create(artist);
            thisArtist.name = artistInfo['artist_name'];
            thisArtist.image = artistInfo['artist_image'];
            thisArtist.url = artistInfo['artist_url'];
            return thisArtist;
        }

        // Create an structured ArtistObject 
        function getTrackObject (trackInfo) {
            const track = {};
            const thisTrack = Object.create(track);
            thisTrack.name = trackInfo['track_name'];
            thisTrack.artist = trackInfo['track_artist'];
            thisTrack.url = trackInfo['track_url'];
            thisTrack.popularity = trackInfo['track_popularity'];
            return thisTrack;
        }

        /* Async function that maps through a users artistPreferences IDs
        and use helper functions to return an array of artistPreferences DATAs */
            async function getArtistsArray (user_id) {
            const this_artist_ids = await getArtistIdCollection(user_id);
            const array = await Promise.all(this_artist_ids[0].map(async (artist) => {
                const this_artist_info = await getArtistInfo(artist.artist_id);
                return this_artist_info;                

            }));
            return array;
        };


        /* Async function that maps through a users artistPreferences IDs
        and use helper functions to return an array of artistPreferences DATAs */
        async function getTracksArray (user_id) {
            const this_track_ids = await getTrackIdCollection(user_id);
            const array = await Promise.all(this_track_ids[0].map(async (track) => {
                const this_track_info = await getTrackInfo(track.track_id);
                return this_track_info;                

            }));
            return array;
        };

/*      Async function that await artistPreferencesData and then render
        a view to the website
 */     
        async function renderView () {

            try {
                const current_username = req.session.passport.user.username;
                const user_info = await pool.query('SELECT * from users WHERE username = ?', [current_username]);
                const user_id = user_info[0][0].user_id;
                await getArtistsArray(user_id).then(getArtistReturnVal => {
                    artistArray = [];
                    getArtistReturnVal.map(artist => {
                        artistArray.push(getArtistObject(artist[0][0]));
                    })
                });
                await getTracksArray(user_id).then(getTrackReturnVal => {
                    trackArray = [];
                    getTrackReturnVal.map(track => {
                        trackArray.push(getTrackObject(track[0][0]));
                    })
                });
                        
                res.render('dashboard', {
                    name: req.user.displayName,
                    artistPreferences: artistArray,
                    trackPreferences: trackArray
                });
            } catch (error) {
                console.log(error);
                console.log('Current user from session not found in DB, logging out, redirecting to log-in...');
                req.logout();
                res.redirect('/');
            }     
        }

        /* Invoking main function */
        renderView();
});


module.exports = router;


/*      async function renderView () {
    res.render('dashboard', {
        name: req.user.displayName,
        artistPreferences: await getArtistsArray('1')
    })
} */