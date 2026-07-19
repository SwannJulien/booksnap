package net.booksnap.domain.borrowing.api.dto;

import jakarta.validation.constraints.NotNull;

public record CreateBorrowingRequest(
        @NotNull(message = "User ID is required")
        Long userId,

        @NotNull(message = "Copy ID is required")
        Long copyId
) {}
