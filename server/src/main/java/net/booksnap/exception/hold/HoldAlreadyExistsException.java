package net.booksnap.exception.hold;

public class HoldAlreadyExistsException extends RuntimeException {
    public HoldAlreadyExistsException(Long userId, Long bookId) {
        super("User " + userId + " already has an active hold on book " + bookId);
    }
}
