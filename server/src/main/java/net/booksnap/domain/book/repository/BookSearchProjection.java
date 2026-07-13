package net.booksnap.domain.book.repository;

/**
 * Projection interface for native query results in book search.
 * Maps directly to query columns.
 */
public interface BookSearchProjection {
    Long getId();
    String getTitle();
    String getIsbn10();
    String getIsbn13();
    String getAuthors();
}
