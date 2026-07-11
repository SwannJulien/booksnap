package net.booksnap.domain.copy.api.dto;

import net.booksnap.domain.book.api.dto.BookDTO;
import net.booksnap.domain.common.dto.AuditDTO;
import net.booksnap.domain.library.api.dto.LibraryDTO;

public record CopyResponse (
        Long id,
        LibraryDTO library,
        BookDTO book,
        String codeIdentification,
        String status,
        AuditDTO audit
) {}
