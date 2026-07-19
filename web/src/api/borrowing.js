import { API_BASE_URL, API_ROUTES } from './api-routes.js';

export async function getBorrowingByCopyId(copyId) {
  const response = await fetch(
    `${API_BASE_URL}${API_ROUTES.BORROWINGS}/${copyId}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch borrowing: ${response.status}`);
  }

  return await response.json();
}
