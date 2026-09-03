import { API_BASE_URL, API_ROUTES } from './api-routes.js';
import { apiFetch } from './http.js';

/**
 * Replaces the signed-in user's own password.
 *
 * There is no user parameter on purpose: the server acts on the account its session
 * names and ignores anything else. Nothing here goes into the URL either — a query
 * string ends up in the access log, in the browser history, and in the Referer of the
 * next request.
 *
 * Succeeding also signs the user out of their other browsers; this one stays valid.
 *
 * Throws on failure, with error.status attached: 400 when the current password is wrong
 * or the new one breaks a rule (error.message says which), 409 when the account signs in
 * through a provider that owns its password.
 *
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export async function changePassword(currentPassword, newPassword) {
  const response = await apiFetch(`${API_BASE_URL}${API_ROUTES.PASSWORD}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData.message || `Failed to change password: ${response.status}`,
    );
    error.status = response.status;
    throw error;
  }

  // 204, no body to read.
}
