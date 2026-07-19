package net.booksnap.exception.borrowing;

public class BorrowingNotFoundException extends RuntimeException {
    public BorrowingNotFoundException(Long copyId) {
        super("No active borrowing found for copy ID: " + copyId);
    }
}
