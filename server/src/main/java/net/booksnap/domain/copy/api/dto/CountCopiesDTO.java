package net.booksnap.domain.copy.api.dto;

public record CountCopiesDTO(
        long totalNumberOfCopies,
        long availableCopies) {}
