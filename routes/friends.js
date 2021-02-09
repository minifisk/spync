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

    async function mapFriends() {
        const current_username = req.session.passport.user.username;
        const this_user_info = await pool.query('SELECT * from users WHERE username = ?', [current_username]);
        const this_user_id = this_user_info[0][0].user_id;
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
    
        // Array for storing data for friends
        let friendsData = [];
    
        friends.map(async (friend) => {
            friendsData.push(await getUserData(friend));
        })

        return friendsData;
    }

    async function renderView () {
        console.log(await mapFriends());
        res.render('friends/view');

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

                    res.render('friends/add', {
                        contactCode: contactCode,
                        prompt: 'Friend added successfully: ',
                        userid : addressee_user_id,
                        username: user_name,
                        displayname: display_name
                    });
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
