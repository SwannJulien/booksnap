package net.booksnap.domain.hold.api.dto;

import net.booksnap.domain.hold.Status;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * A hold as the holds list shows it.
 *
 * @param placedOn  when the student queued; also their rank in the queue, oldest first
 * @param startDate start of the pickup window, null while the hold is still pending
 * @param endDate   collect-before date, null while the hold is still pending
 * @param copyId    the copy set aside, null while the hold is still pending. Present
 *                  means the copy can be handed over, which fulfills the hold.
 */
public record HoldResponse(
        Long id,
        Status status,
        LocalDateTime placedOn,
        LocalDate startDate,
        LocalDate endDate,
        Long copyId,
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
