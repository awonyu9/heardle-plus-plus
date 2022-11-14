require('dotenv').config();
const express = require('express');
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const router = express();
const port = 8888;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

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

const stateKey = 'spotify_auth_state';

router.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

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
  }).toString();
  
  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});


router.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  // const data = getToken(res, code);
  // res.send(data);

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
      }).toString(),
    });

    const data = await response.json();

    // console.log("from login endpoint", data);
    
    if (response.status === 200) {
      const { access_token, refresh_token, expires_in } = data;

      const params = new URLSearchParams({
        access_token,
        refresh_token,
        expires_in,
      }).toString();

      // const t = await fetch(`http://localhost:8888/refresh_token?refresh_token=${refresh_token}`, {
      // })

      // const tt = await t.json();
      // res.send(tt);

      res.redirect(`http://localhost:3000/?${params}`);
    } else {
      res.redirect(`/?${new URLSearchParams({error: 'invalid_token'}).toString()}`);
    }
    
  } catch (error) {
    res.send(error);
  }
});

router.get('/refresh_token', async (req, res) => {
  const { refresh_token } = req.query;
  // const refresh_token = req.query.refresh_token;

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
      }).toString(),
    });

    const data = await response.json();

    // console.log(data);
    
    res.send(data);
    
  } catch (error) {
    res.send(error);
  }
});

// router.get('/login', (req, res) => {

// });

router.get('/', (req, res) => {
  res.send('Express home page');
})

router.listen(port, () => {
  console.log('---------------------\nServer running on port', port);
});