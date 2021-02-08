const pool = require('../config/db');


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


module.exports = {getArtistIdCollection, getTrackIdCollection, getArtistInfo, getTrackInfo};