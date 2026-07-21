package net.booksnap.exception.borrowing;

public class BorrowingAlreadyReturnedException extends RuntimeException {
    public BorrowingAlreadyReturnedException(Long borrowingId) {
        super("Borrowing " + borrowingId + " has already been returned");
    }
}
