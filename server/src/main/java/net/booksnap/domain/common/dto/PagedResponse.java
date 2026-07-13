package net.booksnap.domain.common.dto;

import org.springframework.data.domain.Page;

import java.util.List;

public record PagedResponse<T>(
    List<T> data,
    PageInfo page
) {
    public static <T> PagedResponse<T> of(Page<T> page) {
        return new PagedResponse<>(
            page.getContent(),
            new PageInfo(
                page.getSize(),
                page.getNumber() + 1,
                page.getTotalElements(),
                page.getTotalPages()
            )
        );
    }

    public record PageInfo(
        int size,
        int page,
        long totalElements,
        int totalPages
    ) {}
}