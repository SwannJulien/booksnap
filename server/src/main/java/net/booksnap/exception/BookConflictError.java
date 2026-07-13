package net.booksnap.exception;

import java.time.LocalDateTime;

public record BookConflictError(
    LocalDateTime timestamp,
    int status,
    String message,
    String path,
    Long bookId
) {}
