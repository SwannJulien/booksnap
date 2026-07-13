import { fetchBookByIsbn } from './openLibrary.js';
import { postBook } from './book.js';
import { uploadCover } from './cover.js';
import { mapBookFormData } from '../utils/formDataMapper.js';

/**
 * Gets the primary ISBN to use for cover operations
 * Prefers ISBN-13 over ISBN-10 for consistency
 * @param {Object} bookData - Book data that may contain isbn, isbn10, or isbn13
 * @returns {string|null} The ISBN to use for covers
 */
function getPrimaryIsbn(bookData) {
  return bookData.isbn13 || bookData.isbn10 || bookData.isbn || null;
}

/**
 * Service for handling book-related operations
 */
export class BookService {
  /**
   * Fetches book data by ISBN from OpenLibrary
   * @param {string} isbn - The ISBN to search for
   * @returns {Promise<Object>} The book data
   * @throws {Error} If book not found or fetch fails
   */
  static async fetchByIsbn(isbn) {
    const book = await fetchBookByIsbn(isbn);
    const [firstBook] = Object.values(book);
    return firstBook;
  }

  /**
   * Creates a new book in the system with optional cover upload
   * @param {Object} formData - The book form data
   * @param {File|string|null} cover - Cover file or URL (optional)
   * @param {number} libraryId - The library ID
   * @returns {Promise<Object>} Response with status and body
   */
  static async createBook(formData, cover = null, libraryId = 1) {
    // Get the primary ISBN BEFORE mapping (while isbn field still exists)
    const primaryIsbn = getPrimaryIsbn(formData);

    // Transform and prepare book data
    const bookData = mapBookFormData(formData);
    bookData.libraryId = libraryId;

    // Create the book
    const response = await postBook(bookData);

    // Upload cover if book was successfully created
    // Use the same ISBN that will be stored/used for the book
    if (response.status === 201 && cover && primaryIsbn) {
      try {
        await uploadCover(cover, primaryIsbn);
      } catch (err) {
        // Silent error - upload failure doesn't block book creation
      }
    }

    return response;
  }
}
