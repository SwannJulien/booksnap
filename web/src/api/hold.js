import { API_BASE_URL, API_ROUTES } from './api-routes.js';

// Places a hold on a book for a user. The hold is queued (pending) until a copy of the
// book is returned and reaches the head of the queue.
export async function createHold(bookId, userId) {
  const response = await fetch(`${API_BASE_URL}${API_ROUTES.HOLDS}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookId, userId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData.message || `Failed to create hold: ${response.status}`,
    );
    // 409 means this student already has an active hold on this book
    error.status = response.status;
    throw error;
  }

  return response.json();
}
