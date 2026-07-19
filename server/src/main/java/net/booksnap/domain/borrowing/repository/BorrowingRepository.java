package net.booksnap.domain.borrowing.repository;

import net.booksnap.domain.borrowing.Borrowing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {
}
