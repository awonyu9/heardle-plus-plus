// Map for localStorage keys
const LOCALSTORAGE_KEYS = {
  accessToken: "spotify_access_token",
  refreshToken: "spotify_refresh_token",
  expireTime: "spotify_token_expire_time",
  timestamp: "spotify_token_timestamp",
};

// Map to retrieve localStorage values
const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};

/**
 * Handles logic for retrieving the Spotify access token from localStorage
 * or URL query params
 * @returns {string} A Spotify access token
 */
function getAccessToken() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get("access_token"),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get("refresh_token"),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get("expires_in"),
  };
  const hasError = urlParams.get("error");

  // If there's an error OR the token in localStorage has expired, refresh the token
  if (hasError || hasTokenExpired() || LOCALSTORAGE_VALUES.accessToken === "undefined") {
    refreshToken();
  }

  // If there is a valid access token in localStorage, use that
  if (LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== "undefined") {
    return LOCALSTORAGE_VALUES.accessToken;
  }

  // If there is a token in the URL query params, user is logging in for the first time
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    // Store the query params in localStorage
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }
    // Set timestamp
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
    // Return access token from query params
    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }

  return false;
}

export const accessToken = getAccessToken();

/**
 * Checks if the amount of time that has elapsed between the timestamp in localStorage
 * and now is greater than the expiration time of 3600 seconds (1 hour).
 * @returns {boolean} Whether or not the access token in localStorage has expired
 */
function hasTokenExpired() {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
  if (!accessToken || !timestamp) {
    return false;
  }
  const millisecondsElapsed = Date.now() - Number(timestamp);
  return (millisecondsElapsed / 1000) > Number(expireTime);
}

/**
 * Use the refresh token in localStorage to hit the /refresh_token endpoint
 * in our Node app, then update values in localStorage with data from response.
 * @returns {void}
 */
async function refreshToken() {
  try {
    // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
    if (!LOCALSTORAGE_VALUES.refreshToken ||
      LOCALSTORAGE_VALUES.refreshToken === "undefined" ||
      (Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000) < 1000
      ) {
        console.error("No refresh token available");
        logout();
      }

      // Use `/refresh_token` endpoint from our Node app
      const res = await fetch(`http://127.0.0.1:8888/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`);
      const data = await res.json();

      console.log("from refreshToken()", data);

      // Update localStorage values
      window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.accessToken);
      window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

      // Reload the page for localStorage updates to be reflected
      window.location.reload();

  } catch (error) {
    console.log(error);
  }
}

/**
 * Clear out all localStorage items we've set and reload the page
 * @returns {void}
 */
export function logout() {
  // Clear all localStorage items
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }

  // Navigate to homepage
  window.location = window.location.origin;
}

const BASE_URL = "https://api.spotify.com/v1";
const OPTIONS = {
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    }
}

export async function getCurrentUserProfile() {
  // console.log(OPTIONS);
  const res = await fetch(`${BASE_URL}/me`, OPTIONS);
  return res.json();
}

export async function getUserPlaylists(limit=10, offset=0) {
  const res = await fetch(`${BASE_URL}/me/playlists?limit=${limit}&offset=${offset}`, OPTIONS);
  const data = await res.json();
  return data;
}

export async function getPlaylist(playlist_id="37i9dQZF1EVJSvZp5AOML2") {
  const res = await fetch(`${BASE_URL}/playlists/${playlist_id}`, OPTIONS);
  return res.json();
}

// export function getRandomTrack(tracks) {
//   const
// }