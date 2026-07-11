package net.booksnap.domain.common.dto;

import java.util.List;

public record ListResponse<T>(
    List<T> data
) {}