package net.booksnap.domain.hold.repository;

import net.booksnap.domain.hold.Hold;
import net.booksnap.domain.hold.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface HoldRepository extends JpaRepository<Hold, Long> {

    // Queue head: the student who has been waiting longest for this book
    Optional<Hold> findFirstByBookIdAndStatusOrderByCreatedDateAsc(Long bookId, Status status);

    // The hold a copy is currently being kept for, so its owner can still borrow it
    Optional<Hold> findFirstByCopyIdAndStatus(Long copyId, Status status);

    // Pending holds that waited too long without ever getting a copy
    List<Hold> findByStatusAndCreatedDateBefore(Status status, LocalDateTime cutoff);

    // A user may only queue once per book (mirrors the uq_hold_one_active_per_user_book index)
    boolean existsByUserIdAndBookIdAndStatusIn(Long userId, Long bookId, List<Status> statuses);

    // Size of the pending queue for a book, used to report a new hold's position
    long countByBookIdAndStatus(Long bookId, Status status);
}
