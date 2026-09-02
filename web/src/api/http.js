import { API_BASE_URL, API_ROUTES } from './api-routes.js';

// Names fixed by Spring Security's CookieCsrfTokenRepository. Changing either one here
// alone means every write answers 403.
const CSRF_COOKIE = 'XSRF-TOKEN';
const CSRF_HEADER = 'X-XSRF-TOKEN';
const CSRF_COOKIE_PATTERN = new RegExp(`(?:^|;\\s*)${CSRF_COOKIE}=([^;]*)`);

// The methods Spring Security exempts from CSRF, and for the same reason: they are the
// ones that are supposed to change nothing. An endpoint that writes on a GET is outside
// this protection — that is a reason not to write such an endpoint.
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE']);

// Shared between concurrent writes so that a page firing several at once asks the server
// for a token once rather than once per call.
let pendingTokenRequest = null;

function readCsrfToken() {
  const match = document.cookie.match(CSRF_COOKIE_PATTERN);
  return match ? decodeURIComponent(match[1]) : null;
}

// Any response would set the cookie; this endpoint exists so a client that needs one has
// something meaningful to call. Required before the very first write of a browser
// session, the login included.
async function requestCsrfToken() {
  pendingTokenRequest ??= fetch(`${API_BASE_URL}${API_ROUTES.CSRF}`, {
    method: 'GET',
    credentials: 'include',
  }).finally(() => {
    pendingTokenRequest = null;
  });

  await pendingTokenRequest;
}

/**
 * Calls the BookSnap API: sends the session cookie, and the CSRF token on writes.
 *
 * Same signature as fetch and same return: the caller still reads response.ok and
 * response.status, and still throws its own Error with error.status attached.
 *
 * Use plain fetch for anything that is not our API — a third-party call must not be sent
 * our credentials.
 *
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
export async function apiFetch(url, options = {}) {
  const method = (options.method ?? 'GET').toUpperCase();

  // Without this the browser attaches no cookie on a cross-origin call, and the request
  // arrives unauthenticated. Harmless when same-origin, so it is set unconditionally.
  const init = { ...options, method, credentials: 'include' };

  if (!SAFE_METHODS.has(method)) {
    let token = readCsrfToken();

    if (!token) {
      await requestCsrfToken();
      token = readCsrfToken();
    }

    // A missing token is not turned into an error here: let the request go and let the
    // server answer 403. Failing early would hide the real cause, which is that the
    // cookie could not be read — a different domain, or HttpOnly set by mistake.
    if (token) {
      init.headers = { ...options.headers, [CSRF_HEADER]: token };
    }
  }

  return fetch(url, init);
}
