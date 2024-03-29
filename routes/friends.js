const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const pool = require('../config/db');

// @Desc    Show add page
// @route    GET /friends/add
router.get('/add', ensureAuth, async (req, res) => {

    const current_username = req.session.passport.user.username;
    const user_info = await pool.query('SELECT * from users WHERE username = ?', [current_username]);
    const contactCode = user_info[0][0].contactCode;

    res.render('friends/add', {
        contactCode: contactCode
    });
})

// @Desc    Remove friend
// @route    GET /friends/remove
router.post('/remove', ensureAuth, async (req, res) => {

    try {
        const currentUserData = await pool.query('SELECT user_id FROM users WHERE username = ?', [req.session.passport.user.username]);
        const currentUserId = currentUserData[0][0].user_id;
        const friendToDeleteData = await pool.query('SELECT user_id FROM users WHERE contactCode = ?', [req.body.contactCode]);
        const friendToDeleteId = friendToDeleteData[0][0].user_id;
        await pool.query('DELETE FROM friendships WHERE requester_id = ? AND addressee_id = ? OR requester_id = ? AND addressee_id = ?', [currentUserId, friendToDeleteId, friendToDeleteId, currentUserId]);
        res.redirect('./view')
    } catch (error) {
        console.log(error)
        res.redirect('./view')
    }
})

// @Desc    Remove friend
// @route    GET /friends/remove
router.post('/compare', ensureAuth, async (req, res) => {

    try {
        const currentUserData = await pool.query('SELECT user_id FROM users WHERE username = ?', [req.session.passport.user.username]);
        const currentUserId = currentUserData[0][0].user_id;
        const friendToCompareWihData = await pool.query('SELECT * FROM users WHERE contactCode = ?', [req.body.contactCode]);
        const friendToCompareWihID = friendToCompareWihData[0][0].user_id;
        const friendToCompareWihName = friendToCompareWihData[0][0].displayName;

        
        // Get track preferences that both have
        const commonTracks = await pool.query('SELECT user1.user_id AS user_1, user2.user_id AS user_2, user2.track_id FROM trackPreferences AS user1 INNER JOIN trackPreferences AS user2 ON user2.track_id = user1.track_id AND user2.user_id <> user1.user_id WHERE user1.user_id = ? AND user2.user_id = ?', [friendToCompareWihID, currentUserId]);
        const commonTracksCount = commonTracks[0].length;
        const trackArray = [];
        
        await Promise.all(
            commonTracks[0].map(async (track) => {
                const trackData = await pool.query('SELECT * FROM tracks WHERE track_id = ?', [track.track_id]);
                trackArray.push({track_name: trackData[0][0].track_name, track_artist: trackData[0][0].track_artist, track_url: trackData[0][0].track_url, track_popularity: trackData[0][0].track_popularity})
            })
        )
   
        // Get artist preferences that both have
        const commonArtists = await pool.query('SELECT user1.user_id AS user_1, user2.user_id AS user_2, user2.artist_id FROM artistPreferences AS user1 INNER JOIN artistPreferences AS user2 ON user2.artist_id = user1.artist_id AND user2.user_id <> user1.user_id WHERE user1.user_id = ? AND user2.user_id = ?', [friendToCompareWihID, currentUserId]);
        const commonArtistsCount = commonArtists[0].length;
        const artistArray = [];
        
        await Promise.all(
            commonArtists[0].map(async (artist) => {
                const artistData = await pool.query('SELECT * FROM artists WHERE artist_id = ?', [artist.artist_id]);
                artistArray.push({artist_name: artistData[0][0].artist_name, artist_url: artistData[0][0].artist_url, artist_popularity: artistData[0][0].artist_popularity, artist_image: artistData[0][0].artist_image})
            })
        )

        // Render page
        res.render('friends/compare', {
            trackArray: trackArray,
            artistArray: artistArray,
            friend: friendToCompareWihName
        });

    } catch (error) {
        console.log(error)
        res.redirect('./view')
    }
})

// @Desc    Show overview of friends
// @route    GET /friends/view
router.get('/view', ensureAuth, async (req, res) => {

    // Function for getting a users data and returning an object with it
    async function getUserData(user_id) {
        const user = {};
        const thisUser = Object.create(user);
        const userData = await pool.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
        user.displayName = userData[0][0].displayName;
        user.profilePicture = userData[0][0].profilePicture;
        user.contactCode = userData[0][0].contactCode;
        return user;
    }

    async function mapFriends(this_user_id) {

        const user_friendships1 = await pool.query('SELECT * FROM friendships WHERE requester_id = ?', [this_user_id]);
        const user_friendships2 = await pool.query('SELECT * FROM friendships WHERE addressee_id = ?', [this_user_id]);
    
        // Array for storing friends user ID's
        let friends = [];
        
       
        // Map through friendships where current user is requester
        user_friendships1[0].map(user => {
            friends.push(user.addressee_id);
        })
    
        // Map through friendships where current user is addressee
        user_friendships2[0].map( user => {
            friends.push(user.requester_id);
        })
    
        // !!!! CODE BELOW IS EXPERIMENTAL TO SHOW NUMBER OF MATCHES IN THE
        // VIEW ALL FRIENDS PAGE, NOT WORKING YET !!!!!


        // Array for storing data for friends
        let friendsData = [];
        let commonTracksCount = [];
        let commonArtistsCount = [];

        await Promise.all(

            friends.map(async (friend) => {
                friendsData.push(await getUserData(friend));
                const commonTracks = await pool.query('SELECT user1.user_id AS user_1, user2.user_id AS user_2, user2.track_id FROM trackPreferences AS user1 INNER JOIN trackPreferences AS user2 ON user2.track_id = user1.track_id AND user2.user_id <> user1.user_id WHERE user1.user_id = ? AND user2.user_id = ?', [friend, this_user_id]);
                if (commonTracks[0][0] != null) {
                    commonTracksCount.push(1);
                }
                const commonArtists = await pool.query('SELECT user1.user_id AS user_1, user2.user_id AS user_2, user2.artist_id FROM artistPreferences AS user1 INNER JOIN artistPreferences AS user2 ON user2.artist_id = user1.artist_id AND user2.user_id <> user1.user_id WHERE user1.user_id = ? AND user2.user_id = ?', [friend, this_user_id]);
                if (commonArtists[0][0] != null){
                    commonArtistsCount.push(1);
                }
            })
        )

        // Check if commonTracksCount (which also apply to commonArtistCount) 
        // haven't been filled or have been deleted (which is done 
        //1 time per month for the current user
        const commonColumns = await pool.query('SELECT commonTracksCount FROM friendships WHERE requester_id = ? OR addressee_id = ?',[this_user_id, this_user_id]);
        // If empty, update for each friendship

        return friendsData;
    }

    async function renderView () {
        const current_username = req.session.passport.user.username;
        const this_user_info = await pool.query('SELECT * from users WHERE username = ?', [current_username]);
        const this_user_id = this_user_info[0][0].user_id;
        const friendArray = await mapFriends(this_user_id);
        res.render('friends/view', {
            friendArray: friendArray
        });

    }

    renderView();
})

// @Desc    Process the add form
// @route    POST /friends
router.post('/', ensureAuth, async (req, res) => {
    const current_username = req.session.passport.user.username;
    const user_info = await pool.query('SELECT * from users WHERE username = ?', [current_username]);
    const contactCode = user_info[0][0].contactCode;
    const requester_user_id = user_info[0][0].user_id;

    try {
        
        // Get input data from from post
        const input = req.body.title;
        const inputUpper = input.toUpperCase();
        
        // Get data for the user that is being added
        const user_info = await pool.query('SELECT * from users WHERE contactCode = ?', [inputUpper]);        
        const addressee_user_id = user_info[0][0].user_id;
        const user_name = user_info[0][0].username;
        const display_name = user_info[0][0].displayName;



        // CHeck if friendship already exist

            // Check if any rows where:
            // requester_user_id = requester_ud AND addressee_user_ud = addressee_id
            // OR
            // requester_user_ud = addresee_id AND addresee_user_id = requester_id
            try {
                const friendshipStatus = await pool.query('SELECT * FROM friendships WHERE requester_id = ? AND addressee_id = ? OR requester_id = ? AND addressee_id = ?', [requester_user_id, addressee_user_id, addressee_user_id, requester_user_id]);         
                

                if (friendshipStatus[0].length > 0 || addressee_user_id === requester_user_id) {

                    // If friendship already exist only return message
                    res.render('friends/add', {
                        contactCode: contactCode,
                        error: 'Friend already added or you are trying to add yourself!'
                    });
                    
                } 
                               
                
                else {
                    // If it don't exist, Update friendship in database
                    await pool.query('INSERT INTO friendships (requester_id, addressee_id) VALUES (?, ?)', [requester_user_id, addressee_user_id]);
                    res.redirect('friends/view');
                }
                
            } catch (error) {
                console.log(error)

 
            }




    } catch (error) {
        res.render('friends/add', {
            contactCode: contactCode,
            error: 'No user with that user-code, try again!'
        });
        console.log(error);
    }


})

module.exports = router;
