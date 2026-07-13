package net.booksnap.domain.copy.api.dto;

public record CreateCopyResponse(
    byte[] qrCode,
    String identificationCode,
    Long copyId,
    Long bookId
) {}
