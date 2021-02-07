# spync
An awesome app for comparing your music taste with your friends

Run by:

1) Creating a .ENV file with the following variables 

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
