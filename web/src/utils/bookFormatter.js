/** `FANTASY` / `fantasy` -> `Fantasy` */
export function formatGenre(genre) {
  if (!genre) return '';
  return genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
}

/** The single line under a book title: `J.K. Rowling, Terry Pratchett • 1998` */
export function formatBookMeta(book) {
  const authors = Array.isArray(book.authors)
    ? book.authors.join(', ')
    : book.authors || '';
  return [authors, book.publishingYear].filter(Boolean).join(' • ');
}
