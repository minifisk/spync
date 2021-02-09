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

        // Update friendship in database
        await pool.query('INSERT INTO friendships (requester_id, addressee_id) VALUES (?, ?)', [requester_user_id, addressee_user_id]);

        res.render('friends/add', {
            contactCode: contactCode,
            prompt: 'Friend added successfully: ',
            userid : addressee_user_id,
            username: user_name,
            displayname: display_name
        });

    } catch (error) {
        res.render('friends/add', {
            contactCode: contactCode,
            error: 'No user with that user-code, try again!'
        });
        console.log(error);
    }


})

module.exports = router;
