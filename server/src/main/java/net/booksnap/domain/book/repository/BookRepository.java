package net.booksnap.domain.book.repository;

import net.booksnap.domain.book.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
    Optional<Book> findByIsbn10(String isbn10);
    Optional<Book> findByIsbn13(String isbn13);
    Optional<Book> findByTitleIgnoreCase(String title);

    /**
     * How many *other* books a cover key is shared with. Covers are keyed by the same
     * ISBN precedence the application uses (ISBN-13 first, ISBN-10 as fallback), so a
     * cover may only be moved or deleted when this returns 0.
     */
    @Query("""
            SELECT COUNT(b) FROM Book b
            WHERE b.id <> :bookId
              AND COALESCE(NULLIF(b.isbn13, ''), NULLIF(b.isbn10, '')) = :isbn
            """)
    long countOtherBooksSharingIsbn(@Param("bookId") Long bookId, @Param("isbn") String isbn);
}
