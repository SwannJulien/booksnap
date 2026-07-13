/**
 * Maps stored book format (from API/database) to OpenLibrary format (for book-form-bks)
 */
export function toFormFormat(storedBook) {
  if (!storedBook) return null;

  return {
    id: storedBook.id,
    title: storedBook.title || '',
    authors: storedBook.authors?.map(author => ({ name: author })) || [],
    publish_date: storedBook.publishingYear?.toString() || '',
    identifiers: {
      isbn_10: storedBook.isbn10 ? [storedBook.isbn10] : [],
      isbn_13: storedBook.isbn13 ? [storedBook.isbn13] : [],
    },
    number_of_pages: storedBook.numberOfPages || null,
    publishers: storedBook.publisher ? [storedBook.publisher] : [],
    genres: storedBook.genres || [],
    yearRecommendation: storedBook.yearRecommendation || '',
    codeDewey: storedBook.codeDewey || '',
    isFiction: storedBook.isFiction,
    sectionName: storedBook.sectionName || '',
    cover: storedBook.coverUrl ? { medium: storedBook.coverUrl } : null,
  };
}
