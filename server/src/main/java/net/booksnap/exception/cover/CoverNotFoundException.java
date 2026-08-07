package net.booksnap.exception.cover;

public class CoverNotFoundException extends RuntimeException {
    public CoverNotFoundException(String isbn) {
        super("Cover not found for ISBN: " + isbn);
    }
}
