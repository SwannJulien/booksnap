package net.booksnap.domain.copy.repository;

import net.booksnap.domain.copy.Copy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CopyRepository extends JpaRepository<Copy, Long> {
    
    @Query("SELECT c FROM Copy c " +
           "LEFT JOIN FETCH c.book " +
           "LEFT JOIN FETCH c.library " +
           "WHERE c.book.id = :bookId")
    List<Copy> findAllByBookId(@Param("bookId") Long bookId);
    
    // List<Copy> findByStatus(Status status);
}
