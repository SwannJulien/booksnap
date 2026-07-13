package net.booksnap.domain.book.api.dto;

import java.util.List;

public record BookSearchResult(
        Long id,
        String title,
        List<String> authors,
        String isbn
) {
}
