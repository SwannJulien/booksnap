package net.booksnap.domain.borrowing.api.dto;

import net.booksnap.domain.borrowing.Status;

import java.time.LocalDate;

public record GetBorrowingResponse(
        net.booksnap.domain.copy.Status copyStatus,
        String bookTitle,
        BorrowingDetails borrowing
) {
    public record BorrowingDetails(
            Long id,
            Long copyId,
            Long userId,
            Status status,
            LocalDate startDate,
            LocalDate endDate
    ) {}
}
