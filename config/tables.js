const pool = require('./db');


/* FUNCTIONS FOR CREATING TABLES */

// Create a usertable
  async function createUsers() {
/*     await pool.query('SET FOREIGN_KEY_CHECKS=0');
 *//*     await pool.query('DROP TABLE users');
 */    await pool.query('CREATE TABLE IF NOT EXISTS users(user_id INTEGER NOT NULL AUTO_INCREMENT, username varchar(40), displayName varchar(40), profilePicture varchar(300), email varchar(255), contactCode varchar(7), added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY(user_id))');
    console.log('Done');
  }

/*   createUsers();
 */

  
 
  
  // Create a tracktable
  async function createTracks() {
    /*     await pool.query('SET FOREIGN_KEY_CHECKS=0');
     *//*     await pool.query('DROP TABLE users');
     */    
       await pool.query('CREATE TABLE IF NOT EXISTS tracks(track_id INTEGER NOT NULL AUTO_INCREMENT, track_name varchar(255), track_artist varchar(255), track_url varchar(300), track_popularity int, added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY(track_id))');
        console.log('Done');
      }
    
/*       createTracks();
 */    
  
  
  // Create a artisttable
  
  async function createArtists() {
    /*     await pool.query('SET FOREIGN_KEY_CHECKS=0');
     *//*     await pool.query('DROP TABLE users');
     */    
       await pool.query('CREATE TABLE IF NOT EXISTS artists(artist_id INTEGER NOT NULL AUTO_INCREMENT, artist_name varchar(255), artist_url varchar(300), artist_popularity int, artist_image varchar(300), added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY(artist_id))');
        console.log('Done');
      }
    
/*       createArtists();
 */    
  
  
  
  
  
  
  // Create a Track preferences table

  async function createTrackPreferences() {
    /*     await pool.query('SET FOREIGN_KEY_CHECKS=0');
     *//*     await pool.query('DROP TABLE users');
     */    
       await pool.query('CREATE TABLE trackPreferences (user_id INTEGER NOT NULL, track_id INTEGER NOT NULL, artist_name varchar(255), added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(user_id), FOREIGN KEY(track_id) REFERENCES tracks(track_id))');
        console.log('Done');
      }
    
/*       createTrackPreferences();
 */  
  
 
  
  // Create a artist preferences table

  async function createArtistPreferences() {
    /*     await pool.query('SET FOREIGN_KEY_CHECKS=0');
     *//*     await pool.query('DROP TABLE users');
     */    
       await pool.query('CREATE TABLE artistPreferences (user_id INTEGER NOT NULL, artist_id INTEGER NOT NULL, added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(user_id), FOREIGN KEY(artist_id) REFERENCES artists(artist_id))');
        console.log('Done');
      }
    
/*       createArtistPreferences();
 */  

  // Create a artist preferences table

  async function createFriendships() {
    /*     await pool.query('SET FOREIGN_KEY_CHECKS=0');
     *//*     await pool.query('DROP TABLE friendships');
     */    
       await pool.query('CREATE TABLE friendships (requester_id INTEGER NOT NULL, addressee_id INTEGER NOT NULL, added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY(requester_id) REFERENCES users(user_id), FOREIGN KEY(addressee_id) REFERENCES users(user_id))');
        console.log('Done');
      }
    
/*       createFriendships();
 */  

  

   
