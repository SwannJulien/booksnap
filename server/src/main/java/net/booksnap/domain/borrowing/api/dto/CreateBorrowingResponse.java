package net.booksnap.domain.borrowing.api.dto;

import net.booksnap.domain.borrowing.Status;

import java.time.LocalDate;

public record CreateBorrowingResponse(
        Long id,
        Long copyId,
        Long userId,
        Status status,
        LocalDate startDate,
        LocalDate endDate
) {}
