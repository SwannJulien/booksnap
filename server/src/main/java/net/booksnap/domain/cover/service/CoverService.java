package net.booksnap.domain.cover.service;

public interface CoverService {
    void uploadCoverImage(byte[] imageData, String isbn);
    byte[] getCoverImage(String isbn);
}
