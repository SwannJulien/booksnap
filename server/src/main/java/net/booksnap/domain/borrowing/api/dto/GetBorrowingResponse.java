package net.booksnap.domain.borrowing.api.dto;

import net.booksnap.domain.borrowing.Status;

import java.time.LocalDate;

/**
 * @param hold the student this copy is being kept for, set only while the copy is
 *             on hold. Lending it to anybody else is refused, so the caller needs to
 *             know who may collect it — and by when.
 */
public record GetBorrowingResponse(
        net.booksnap.domain.copy.Status copyStatus,
        String bookTitle,
        BorrowingDetails borrowing,
        HoldDetails hold
) {
    public record BorrowingDetails(
            Long id,
            Long copyId,
            Long userId,
            Status status,
            LocalDate startDate,
            LocalDate endDate
    ) {}

    public record HoldDetails(
            Long id,
            Long userId,
            String firstName,
            String lastName,
            LocalDate startDate,
            LocalDate endDate
    ) {}
}
