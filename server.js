const express = require('express');
const Router = require('express-promise-router');
const path = require('path');
var bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

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

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
// function getNewToken(oAuth2Client, callback) {
function getNewToken(oAuth2Client) {
  console.log("getting new token need to fix this");
  // const authUrl = oAuth2Client.generateAuthUrl({
  //   access_type: 'offline',
  //   scope: SCOPES,
  // });
  // console.log('Authorize this app by visiting this url:', authUrl);
  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });
  // rl.question('Enter the code from that page here: ', (code) => {
  //   rl.close();
  //   oAuth2Client.getToken(code, (err, token) => {
  //     if (err) return console.error('Error while trying to retrieve access token', err);
  //     oAuth2Client.setCredentials(token);
  //     // Store the token to disk for later program executions
  //     fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
  //       if (err) return console.error(err);
  //       console.log('Token stored to', TOKEN_PATH);
  //     });
  //     // callback(oAuth2Client);
  //   });
  // });
}

// get majors demo
app.get('/api/majors', async (req, res) => {
  console.log("get request");
  console.log(auth);
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data!A2:E',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      console.log('Name, Major:');
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        console.log(`${row[0]}, ${row[1]}`);
        // console.log(`${row[0]}, ${row[4]}`);
      });
    } else {
      console.log('No data found.');
    }
  });
})

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

// get broadcast reach tracker
app.get('/api/ebook', async (req, res) => {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.batchGet({
    spreadsheetId: '1gkD5zCiyiIomR3_TkkoVtgnVmBGCXhphGKn7uy_Zz5I',
    ranges: ['Worldreader/Amazon!H2:H', 'Worldreader/Amazon!I2:I', 'Worldreader/Amazon!N2:N'],
    // range: 'Worldreader/Amazon!M2:M',
  }, (err, sheetsRes) => {
    if (err) return console.log('The API returned an error: ' + err);
    console.log("get ebooks");
    var columns = [];
    let i;
    for (i = 0; i < sheetsRes.data.valueRanges.length; i++) { 
      columns.push(sheetsRes.data.valueRanges[i].values);
    }

    var monthYear = columns[0].map((e, i) => `${e}-${columns[1][i]}`);
    var uniqueMonths = Array.from(new Set(monthYear))
    // console.log(uniqueMonths);

    let j;
    var netPerMonth = {};
    for (j = 0; j < uniqueMonths.length; j++) {
      netPerMonth[uniqueMonths[j]] = 0;
    }

    let k;
    for (k = 0; k < columns[0].length; k++) {
      netPerMonth[monthYear[k]] = netPerMonth[monthYear[k]] + parseInt(columns[2][k][0].replace(/[$.]/g, ""), 10) / 100; 
    }

    var netPerMonthArr = [];
    for (var key in netPerMonth) {
      netPerMonthArr.push([key, netPerMonth[key].toFixed(2)]);
    }
    console.log(netPerMonthArr);
    res.send(netPerMonthArr);
    // var rows = [];
    // let j;
    // console.log(columns[0].length);
    // for (j = 0; j < columns[0].length; j++) {
    //   rows.push([columns[0][j], columns[1][j]]);
    // }
    // const rows = sheetsRes.data.values;
    // if (rows.length) {
    //   console.log(rows.length, ' rows found.');
    //   console.log(rows)
    // } else {
    //   console.log('No data found.');
    // }
    // res.send(rows);
  });
})

// Get scores
app.get('/api/scores', async (req, res) => {
  const query = await db.query('SELECT * FROM players ORDER BY name;');
  res.send(query.rows);
});

// For any request that doesn't match, we'll send the index.html file from the client. This is used for all of our React code.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// Set localhost port for server
const port = process.env.PORT || 5000;
app.listen(port);

console.log(`ubongo dashboard listening on ${port}`);