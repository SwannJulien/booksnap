package net.booksnap.exception.hold;

public class BookHasAvailableCopyException extends RuntimeException {
    public BookHasAvailableCopyException(Long bookId) {
        super("Cannot place a hold on book " + bookId + ": a copy is available for borrowing");
    }
}
