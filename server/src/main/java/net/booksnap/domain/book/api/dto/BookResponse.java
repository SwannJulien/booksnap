package net.booksnap.domain.book.api.dto;
import net.booksnap.domain.common.dto.AuditDTO;
import net.booksnap.domain.cover.CoverDTO;

import java.util.Set;


public record BookResponse(Long id,
                           String title,
                           String isbn10,
                           String isbn13,
                           String publishingYear,
                           String publisher,
                           int numberOfPages,
                           String yearRecommendation,
                           Boolean isFiction,
                           String codeDewey,
                           Set<String> genres,
                           Set<String> authors,
                           CoverDTO cover,
                           AuditDTO audit ) {}