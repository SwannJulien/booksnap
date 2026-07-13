package net.booksnap.exception.book;

import lombok.Getter;

@Getter
public class BookAlreadyExistsException extends RuntimeException {
    private final Long bookId;

    public BookAlreadyExistsException(String identifier, Long bookId) {
        super("Book already exists with identifier " + identifier);
        this.bookId = bookId;
    }
}