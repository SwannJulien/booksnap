package net.booksnap.exception.dewey;

public class FictionBookHasDeweyCodeException extends RuntimeException {
    public FictionBookHasDeweyCodeException() {
        super("Fiction book can't have a Dewey code.");
    }
}
