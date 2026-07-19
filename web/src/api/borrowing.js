import { API_BASE_URL, API_ROUTES } from './api-routes.js';

// Returns { copyStatus, borrowing | null }, or null when the copy id is unknown.
export async function getBorrowingByCopyId(copyId) {
  const response = await fetch(
    `${API_BASE_URL}${API_ROUTES.BORROWINGS}/${copyId}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch borrowing: ${response.status}`,
    );
  }

  return response.json();
}

export async function createBorrowing(copyId, userId) {
  const response = await fetch(`${API_BASE_URL}${API_ROUTES.BORROWINGS}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ copyId, userId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create borrowing: ${response.status}`,
    );
  }

  return response.json();
}
