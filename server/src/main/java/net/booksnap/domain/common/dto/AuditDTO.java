package net.booksnap.domain.common.dto;

import java.time.LocalDateTime;

public record AuditDTO (
        String createdBy,
        LocalDateTime createdDate,
        String lastUpdatedBy,
        LocalDateTime lastUpdatedDate
) {}