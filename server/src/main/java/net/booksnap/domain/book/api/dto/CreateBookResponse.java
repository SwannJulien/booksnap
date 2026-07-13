package net.booksnap.domain.book.api.dto;

public record CreateBookResponse(
    byte[] qrCode,
    String identificationCode,
    Long copyId,
    Long bookId
) {}