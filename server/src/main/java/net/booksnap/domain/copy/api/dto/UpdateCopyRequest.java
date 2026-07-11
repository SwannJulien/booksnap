package net.booksnap.domain.copy.api.dto;

import net.booksnap.domain.copy.Status;

public record UpdateCopyRequest(
        Long libraryId,

        Status status
) {}