import { fetchBookByIsbn } from './openLibrary.js';
import { postBook, updateBook as putBook } from './book.js';
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
    if (response.status === 201 && cover) {
      if (!primaryIsbn) {
        // Covers are keyed by ISBN, so a book without one cannot hold a cover
        response.coverError = 'A book needs an ISBN before it can have a cover';
      } else {
        try {
          await uploadCover(cover, primaryIsbn);
        } catch (err) {
          // A failed upload doesn't undo the book, but it must not pass unnoticed either
          // eslint-disable-next-line no-console
          console.error('Failed to upload cover:', err);
          response.coverError = err.message;
        }
      }
    }

    return response;
  }

  /**
   * Updates an existing book, replacing its cover only when a new one was picked.
   * The cover is keyed by ISBN, so it is uploaded under the ISBN the book is being
   * saved with — editing the ISBN and the cover together lands both on the new key.
   * @param {Object} formData - The book form data
   * @param {Object} [options]
   * @param {File|string|null} [options.cover] - Cover file or URL currently shown
   * @param {boolean} [options.coverChanged] - Whether the user picked a new image
   * @param {number} [libraryId] - The library ID
   * @returns {Promise<{status: number, isbn: string|null, coverUpdated: boolean, coverError?: string}>}
   */
  static async updateBook(
    formData,
    { cover = null, coverChanged = false } = {},
    libraryId = 1,
  ) {
    const bookData = mapBookFormData(formData);
    bookData.libraryId = libraryId;

    const status = await putBook(bookData.id, bookData);

    const result = {
      status,
      isbn: getPrimaryIsbn(bookData),
      coverUpdated: false,
    };

    if (coverChanged && cover) {
      if (!result.isbn) {
        // Covers are keyed by ISBN, so a book without one cannot hold a cover
        result.coverError = 'A book needs an ISBN before it can have a cover';
      } else {
        try {
          await uploadCover(cover, result.isbn);
          result.coverUpdated = true;
        } catch (err) {
          // The book itself is already saved, so report the failure rather than
          // rolling anything back
          // eslint-disable-next-line no-console
          console.error('Failed to upload cover:', err);
          result.coverError = err.message;
        }
      }
    }

    return result;
  }
}
