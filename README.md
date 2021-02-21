# spync
An awesome app for comparing your music taste with your friends. The app offer you to log in with your Spotify account, and from there the app creates a user account with your spotify username, retriever your top songs and top artists from the latest 6 months and store it in the database. You can view your top music and also add friends and compare their top music by adding them with their unique contact-code, or sharing your unique contact code and letting them add you.

Acknowledgments
Huge thanks to @blahah for helping me figure out some async problems with the passport module. Also huge thanks to @traversymedia for creating this awesome tutorial which have been a crucial inspiration for making this app possible.

Run the app by:

1) Creating a .ENV file with the following variables 

Variables for session secret:

SESSION_SECRET = "your_session_secret" <br>


Variables for a MYSQL database host:

DB_HOST = "database endpoint"<br>
DB_USER = "username"<br>
DB_PASSWORD = "password"<br>
DB_PORT = "port"<br>
DB_NAME = "databasename"<br>

Spotify client variables (create a sportify dev account if you don't have one and create an app: https://developer.spotify.com/dashboard/):

SPOTIFY_CLIENT_ID = "client id"<br>
SPOTIFY_CLIENT_SECRET = "client secret"<br>
SPOTIFY_CALLBACK_URL = "callback url"<br>

2) Run "npm install" to install required modules

3) Run with "nodemon app.js" or "node app.js"

4) Open: http://localhost:8888/ in your browser
