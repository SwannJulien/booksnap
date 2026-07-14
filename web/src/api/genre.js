import { API_BASE_URL, API_ROUTES } from './api-routes.js';

export async function searchGenres(query) {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.GENRES}/search?q=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to search genres: ${error}`);
  }
}
