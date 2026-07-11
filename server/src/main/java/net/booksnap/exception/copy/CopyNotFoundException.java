package net.booksnap.exception.copy;

public class CopyNotFoundException extends RuntimeException {
    public CopyNotFoundException(Long copyId) {
        super("Copy not found with ID: " + copyId);
    }
}
