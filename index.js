require('dotenv').config();
const express = require('express');
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const router = express();
const crypto = require('crypto');
const path = require('path');

// Priority serve any static files.
router.use(express.static(path.resolve(__dirname, './client/build')));

// const port = 8888;
const port = process.env.PORT || 8888;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;
const VERIFIER = base64URLEncode(crypto.randomBytes(32));

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * possible.length);
    text += possible.charAt(randomIndex);
  }

  return text;
}

function base64URLEncode(str) {
  return str.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

const stateKey = 'spotify_auth_state';

router.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);
  var code_challenge = base64URLEncode(sha256(VERIFIER));

  const scope = [
    'user-read-private',
    'playlist-read-private',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope,
    show_dialog: true,
    code_challenge_method: 'S256',
    code_challenge: code_challenge, 
  }).toString();
  
  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: VERIFIER,
      }).toString(),
    });

    const data = await response.json();
    
    if (response.status === 200) {
      const { access_token, refresh_token, expires_in } = data;

      const params = new URLSearchParams({
        access_token,
        refresh_token,
        expires_in,
      }).toString();

      res.redirect(`${FRONTEND_URI}/?${params}`);
    } else {
      res.redirect(`/?${new URLSearchParams({error: 'invalid_token'}).toString()}`);
    }
  } catch (error) {
    res.send(error);
  }
});

router.get('/refresh_token', async (req, res) => {
  const { refresh_token } = req.query;

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: CLIENT_ID,
      }).toString(),
    });

    const data = await response.json();
    
    res.send(data);
  } catch (error) {
    res.send(error);
  }
});

router.get('/', (req, res) => {
  res.send('Express home page');
})

// All remaining requests return the React app, so it can handle routing.
router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

router.listen(port, () => {
  // console.log('---------------------\nServer running on port', port);
  console.log(`Express app listening at http://localhost:${port}`);
});