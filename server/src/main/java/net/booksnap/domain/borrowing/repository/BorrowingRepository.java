package net.booksnap.domain.borrowing.repository;

import net.booksnap.domain.borrowing.Borrowing;
import net.booksnap.domain.borrowing.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {
    Optional<Borrowing> findFirstByCopyIdAndStatusIn(Long copyId, Collection<Status> statuses);
}
