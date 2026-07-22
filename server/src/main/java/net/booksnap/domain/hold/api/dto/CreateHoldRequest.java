package net.booksnap.domain.hold.api.dto;

import jakarta.validation.constraints.NotNull;

public record CreateHoldRequest(
        @NotNull(message = "User ID is required")
        Long userId,

        @NotNull(message = "Book ID is required")
        Long bookId
) {}
