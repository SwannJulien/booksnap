package net.booksnap.domain.book.api.dto;

import net.booksnap.domain.book.KeyStage;
import net.booksnap.domain.copy.Status;

import java.util.List;

public record BookSearchFilter(
        String q,
        List<String> genres,
        List<Status> copyStatuses,
        KeyStage keyStage
) {}
