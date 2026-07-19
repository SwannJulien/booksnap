package net.booksnap.domain.copy;

public enum Status {
    available,
    borrowed,
    on_hold,
    lost,
    damaged,
    removed;

    public boolean isBorrowable() {
        return this == available || this == damaged;
    }
}
