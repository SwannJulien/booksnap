package net.booksnap.domain.copy.api.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.validation.constraints.NotNull;
import net.booksnap.domain.copy.Status;

import java.time.Instant;

@JsonPropertyOrder({"id", "libraryName", "libraryId", "bookTitle", "bookId", "sectionName", "status", "createdAt", "updatedAt"})
public record CreateCopyRequest (
        Long id,
        String bookTitle,
        String libraryName,
        Instant createdAt,
        Instant updatedAt,

        // Request fields (required for POST)
        @NotNull(message = "Book ID is required")
        Long bookId,

        @NotNull(message = "Library ID is required")
        Long libraryId,

        @NotNull(message = "Section name is required")
        String sectionName,

        Status status
) {}