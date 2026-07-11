package net.booksnap.exception.dewey;

public class DeweyCodeNotFoundException extends RuntimeException {
    public DeweyCodeNotFoundException(String code) {
        super("Dewey code not found: " + code);
    }
}
