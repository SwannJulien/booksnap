package net.booksnap.exception.borrowing;

public class BorrowingNotFoundException extends RuntimeException {
    public BorrowingNotFoundException(Long borrowingId) {
        super("Borrowing " + borrowingId + " not found");
    }
}
