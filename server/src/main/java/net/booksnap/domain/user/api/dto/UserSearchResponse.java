package net.booksnap.domain.user.api.dto;

public record UserSearchResponse(
        Long id,
        String firstName,
        String lastName,
        String email
) {}
