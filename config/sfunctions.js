const pool = require('./db');


/* SUPPORTER FUNCTIONS FOR HANDILNG 
USERS, ARTISTS, TRACKS and MUSIC PREFERENCES IN DB */

/* Checking if the user is in database or not, if not, add. Return user ID. */
async function checkUser(username, displayName, profilePicture, email, contactCode) {
    const result = await pool.query('SELECT * from users WHERE username = ?', [username]);
    if (result[0].length < 1) {
      const newResult = await pool.query('INSERT INTO users (username, displayname, profilePicture, email, contactCode) VALUES (?, ?, ?, ?, ?)', [username, displayName, profilePicture, email, contactCode]);
      return newResult[0].insertId;
    }
    return result[0][0].user_id;
  }
  
  /* Checking if artistPreferences either contain tracks older than 30 days or is empty
  If not return false, if yes delete current user rows from artistPreferences and
  trackPreferences table and return true  */
  async function checkPreferences(user_id) {
    const artist30day = await pool.query('SELECT * from artistPreferences WHERE user_id = ? AND added_at <= NOW() - INTERVAL 1 MONTH', [user_id]);
    const track30day = await pool.query('SELECT * from trackPreferences WHERE user_id = ? AND added_at <= NOW() - INTERVAL 1 MONTH', [user_id]);
    const artist = await pool.query('SELECT * from artistPreferences WHERE user_id = ?', [user_id]);
    const track = await pool.query('SELECT * from trackPreferences WHERE user_id = ?', [user_id]);

    // Check if the preference arrays are emty, if so return true
    if(artist[0].length === 0 || track[0].length === 0) {
      return true;
    }

    // Delete preference arrays if they contain rows older thn 30 days
    if (artist30day[0].length != 0 || track30day[0].length != 0) {
      await pool.query('DELETE FROM artistPreferences WHERE user_id = ?', [user_id]);
      await pool.query('DELETE FROM trackPreferences WHERE user_id = ?', [user_id]);

      // Delete common artists- and trackscount from friendships array to update with values from new preferences
      await pool.query('UPDATE friendships SET commonTracksCount = null, commonArtistsCount = null WHERE requester_id = ? OR addressee_id = ?', [user_id, user_id]);

      return true;
    }
    return false;
  }
  
  /* Inserting users favorite artists in artist-table if not already in db, return
  artist_id */
  async function checkArtist(artist, url, popularity, image) {
    const result = await pool.query('SELECT * from artists WHERE artist_name = ?', [artist]);
    if (result[0].length < 1) {
      const addedArtist = await pool.query('INSERT INTO artists (artist_name, artist_url, artist_popularity, artist_image) VALUES (?, ?, ?, ?)', [artist, url, popularity, image]);
      return await addedArtist[0].insertId;
    }
    return await result[0][0].artist_id;
  }
  
  /* Inserting users favorite tracks in track-table if not already in db, 
  return track_id */
  async function checkTrack(track, artist, url, popularity) {
    const result = await pool.query('SELECT * from tracks WHERE track_name = ? AND track_artist = ?', [track, artist]);
    if (result[0].length < 1) {
      const addedTrack = await pool.query('INSERT INTO tracks (track_name, track_artist, track_url, track_popularity) VALUES (?, ?, ?, ?)', [track, artist, url, popularity]);
      return await addedTrack[0].insertId;
    }
    return await result[0][0].track_id;
  }
  
  /* Adding one artist preferences to artistPreferences table */
  async function addArtistPreferences(user_id, artist_id) {
      try {
        const result = await pool.query('INSERT INTO artistPreferences (user_id, artist_id) VALUES (?, ?)', [user_id, artist_id]);
        return;
      } catch (e) {
        console.log(e);
      }
    }
  
  /* Adding one  track preferences to trackPreferences table */
  async function addTrackPreferences(user_id, track_id, artist_name) {
    try {
      const result = await pool.query('INSERT INTO trackPreferences (user_id, track_id) VALUES (?, ?)', [user_id, track_id, artist_name]);
      return;
    } catch(e) {
      console.log(e)
    } 
  }

  /* Function for generating random string to be attached to each user 
  to be used for adding friends */
  function stringGen(len) {
    var text = "";
    var charset = "ABCDEFGHILIJKLMNOPQRSTUVWZY0123456789";
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
    }

  module.exports = {checkUser, checkPreferences, checkArtist, checkTrack, addArtistPreferences, addTrackPreferences, stringGen};