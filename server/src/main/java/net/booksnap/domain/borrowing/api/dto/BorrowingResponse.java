package net.booksnap.domain.borrowing.api.dto;

import net.booksnap.domain.borrowing.Status;

import java.time.LocalDate;
import java.util.Set;

public record BorrowingResponse(
        Long id,
        Status status,
        LocalDate startDate,
        LocalDate endDate,
        BookDetails book,
        UserDetails user
) {
    public record BookDetails(
            Long id,
            String title,
            String isbn10,
            String isbn13,
            Set<String> authors
    ) {}

    public record UserDetails(
            Long id,
            String firstName,
            String lastName,
            String email
    ) {}
}
