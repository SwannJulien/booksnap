package net.booksnap.domain.borrowing.api.dto;

import net.booksnap.domain.borrowing.Status;

import java.time.LocalDate;

/**
 * @param copyStatus     status of the copy after the return, once the triggers and
 *                       any hold promotion have run
 * @param promotedHoldId the hold this copy has just been reserved for, or null if
 *                       nobody was queued
 */
public record ReturnBorrowingResponse(
        Long id,
        Long copyId,
        Long userId,
        Status status,
        LocalDate returnedOn,
        net.booksnap.domain.copy.Status copyStatus,
        Long promotedHoldId
) {}
