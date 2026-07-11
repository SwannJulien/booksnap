import { API_BASE_URL, API_ROUTES } from './api-routes.js';

export async function postBook(payload) {
  try {
    const response = await fetch(API_BASE_URL + API_ROUTES.BOOKS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    const result = text ? JSON.parse(text) : null;

    return result;
  } catch (error) {
    throw new Error('Failed to post book data');
  }
}
