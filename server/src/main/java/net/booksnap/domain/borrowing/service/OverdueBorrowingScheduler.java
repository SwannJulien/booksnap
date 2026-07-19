package net.booksnap.domain.borrowing.service;

import lombok.extern.slf4j.Slf4j;
import net.booksnap.domain.borrowing.Status;
import net.booksnap.domain.borrowing.repository.BorrowingRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Component
public class OverdueBorrowingScheduler {

    private final BorrowingRepository borrowingRepository;

    public OverdueBorrowingScheduler(BorrowingRepository borrowingRepository) {
        this.borrowingRepository = borrowingRepository;
    }

    // Runs daily after midnight, and once at startup to catch up on days the server was down
    @Scheduled(cron = "0 5 0 * * *")
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void markOverdueBorrowings() {
        int updated = borrowingRepository.markOverdue(Status.borrowed, Status.overdue, LocalDate.now());
        if (updated > 0) {
            log.info("Marked {} borrowing(s) as overdue", updated);
        }
    }
}
