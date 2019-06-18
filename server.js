require('dotenv').config()
const path = require('path');
const fs = require('fs');
const express = require('express');
const readline = require('readline');
const app = express();
const bodyParser = require('body-parser');
const {google} = require('googleapis');
const db = require('./db/database');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Use bodyParser to parse jsons
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// auth variable
var auth;
// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  console.log("credentials read");
  authorize(JSON.parse(content));
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client);
    oAuth2Client.setCredentials(JSON.parse(token));
    auth = oAuth2Client;
  });
}

// get broadcast reach tracker
app.get('/api/broadcast-reach', async (req, res) => {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '18-E7iNshdwdZmSXWZWay8k9IR7opJqF-TX-4GyTz_9E',
    range: 'SUMMARY!A3:B',
  }, (err, sheetsRes) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = sheetsRes.data.values;
    if (rows.length) {
      console.log(rows.length, ' rows found.');
    } else {
      console.log('No data found.');
    }
    console.log(rows);
    res.send(rows);
  });
})

// app.route('/api/ebooks/revenue/:month')
//   .get(function(req, res, next) {
//     db.query(
//       "SELECT * FROM `ebooks` WHERE month = ?", req.params.month,
//       function(error, results, fields) {
//         if (error) throw error;
//         res.json(results);
//       }
//     );
//   });

app.route('/api/revenue/ebooks')
  .get(function(req, res, next) {
    db.query(
      "SELECT month, year, SUM(net) AS revenue FROM `ebooks` GROUP BY month, year",
      function(error, results, fields) {
        if (error) throw error;
        console.log(results);
        res.json(results);
      }
    );
  });

app.route('/api/revenue/albums')
  .get(function(req, res, next) {
    db.query(
      "SELECT month, year, SUM(total_earned) AS revenue FROM `albums` GROUP BY month, year",
      function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
  });

app.route('/api/revenue/ios')
  .get(function(req, res, next) {
    db.query(
      "SELECT month, year, SUM(net) AS revenue FROM `ios_apps` GROUP BY month, year",
      function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
  });



app.get('/status', (req, res) => res.send('Working!'));

// Port 8080 for Google App Engine
app.set('port', process.env.PORT || 8080);
app.listen(8080);