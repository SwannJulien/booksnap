// API URL configured via environment variable (VITE_API_BASE_URL)
// Falls back to localhost:8080 if not set (local development)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ROUTES = {
  BOOKS: '/api/v1/books',
  BORROWINGS: '/api/v1/borrowings',
  COVERS: '/api/v1/covers',
  COPIES: '/api/v1/copies',
  DEWEY: '/api/v1/dewey',
  GENRES: '/api/v1/genres',
};
