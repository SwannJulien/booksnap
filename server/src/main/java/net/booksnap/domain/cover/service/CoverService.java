package net.booksnap.domain.cover.service;

import net.booksnap.domain.cover.Cover;

public interface CoverService {
    void uploadCoverImage(byte[] imageData, String contentType, String isbn);

    Cover getCoverImage(String isbn);

    void deleteCoverImage(String isbn);

    void moveCoverImage(String fromIsbn, String toIsbn);

    void copyCoverImage(String fromIsbn, String toIsbn);
}
