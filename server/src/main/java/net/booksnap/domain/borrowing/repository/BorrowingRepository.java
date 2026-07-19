package net.booksnap.domain.borrowing.repository;

import net.booksnap.domain.borrowing.Borrowing;
import net.booksnap.domain.borrowing.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Optional;

public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {
    Optional<Borrowing> findFirstByCopyIdAndStatusIn(Long copyId, Collection<Status> statuses);

    @Query("""
            SELECT b FROM Borrowing b
            WHERE b.status IN :statuses
              AND (LOWER(b.user.firstName) LIKE LOWER(CONCAT('%', :q, '%'))
                OR LOWER(b.user.lastName) LIKE LOWER(CONCAT('%', :q, '%'))
                OR LOWER(b.user.email) LIKE LOWER(CONCAT('%', :q, '%'))
                OR CAST(b.user.id AS string) LIKE CONCAT('%', :q, '%'))
            """)
    Page<Borrowing> findByStatusInAndUserMatching(@Param("statuses") Collection<Status> statuses,
                                                  @Param("q") String q,
                                                  Pageable pageable);

    @Modifying
    @Query("""
            UPDATE Borrowing b
            SET b.status = :overdue
            WHERE b.status = :borrowed AND b.endDate < :today
            """)
    int markOverdue(@Param("borrowed") Status borrowed,
                    @Param("overdue") Status overdue,
                    @Param("today") LocalDate today);
}
