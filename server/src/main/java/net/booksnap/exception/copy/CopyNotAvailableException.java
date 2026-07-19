package net.booksnap.exception.copy;

import net.booksnap.domain.copy.Status;

public class CopyNotAvailableException extends RuntimeException {
    public CopyNotAvailableException(Long copyId, Status status) {
        super("Copy " + copyId + " cannot be borrowed (status: " + status + ")");
    }
}
