package net.booksnap.domain.cover.service;

import net.booksnap.domain.cover.Cover;
import net.booksnap.domain.cover.repository.CoverRepository;
import net.booksnap.exception.common.BadRequestException;
import net.booksnap.exception.cover.CoverNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CoverServiceImpl implements CoverService {

    private static final Logger log = LoggerFactory.getLogger(CoverServiceImpl.class);

    private static final String DEFAULT_CONTENT_TYPE = "image/jpeg";

    private final CoverRepository coverRepository;

    @Value("${booksnap.cover.max-size-bytes:2097152}")
    private int maxSizeBytes;

    public CoverServiceImpl(CoverRepository coverRepository) {
        this.coverRepository = coverRepository;
    }

    @Override
    @Transactional
    public void uploadCoverImage(byte[] imageData, String contentType, String isbn) {
        if (isbn == null || isbn.isBlank()) {
            throw new BadRequestException("ISBN is required to upload a cover");
        }
        if (imageData == null || imageData.length == 0) {
            throw new BadRequestException("Cover image is empty");
        }
        if (imageData.length > maxSizeBytes) {
            throw new BadRequestException(
                    "Cover image is too large: " + imageData.length + " bytes (maximum " + maxSizeBytes + ")");
        }

        String resolvedContentType = resolveContentType(contentType);

        Cover cover = coverRepository.findById(isbn).orElseGet(() -> {
            Cover created = new Cover();
            created.setIsbn(isbn);
            return created;
        });
        cover.setImage(imageData);
        cover.setContentType(resolvedContentType);
        coverRepository.save(cover);

        log.info("Stored cover for ISBN: {} ({} bytes, {})", isbn, imageData.length, resolvedContentType);
    }

    @Override
    @Transactional(readOnly = true)
    public Cover getCoverImage(String isbn) {
        return coverRepository.findById(isbn)
                .orElseThrow(() -> new CoverNotFoundException(isbn));
    }

    @Override
    @Transactional
    public void deleteCoverImage(String isbn) {
        if (isbn == null || isbn.isBlank()) {
            return;
        }
        if (coverRepository.existsById(isbn)) {
            coverRepository.deleteById(isbn);
            log.info("Deleted cover for ISBN: {}", isbn);
        }
    }

    @Override
    @Transactional
    public void moveCoverImage(String fromIsbn, String toIsbn) {
        if (fromIsbn == null || toIsbn == null || fromIsbn.equals(toIsbn)) {
            return;
        }
        if (!coverRepository.existsById(fromIsbn)) {
            return;
        }

        // The copy is skipped when the destination already has a cover, but the source
        // still has to go — the book that pointed at it doesn't anymore
        copyCoverImage(fromIsbn, toIsbn);
        deleteCoverImage(fromIsbn);

        log.info("Moved cover from ISBN: {} to ISBN: {}", fromIsbn, toIsbn);
    }

    @Override
    @Transactional
    public void copyCoverImage(String fromIsbn, String toIsbn) {
        if (fromIsbn == null || toIsbn == null || fromIsbn.equals(toIsbn)) {
            return;
        }

        // A cover belongs to an edition, so an ISBN that already has one keeps it. Only
        // an explicit upload replaces a cover; this never does.
        if (coverRepository.existsById(toIsbn)) {
            return;
        }

        Optional<Cover> source = coverRepository.findById(fromIsbn);
        if (source.isEmpty()) {
            return;
        }

        Cover target = new Cover();
        target.setIsbn(toIsbn);
        target.setImage(source.get().getImage());
        target.setContentType(source.get().getContentType());
        coverRepository.save(target);

        log.info("Copied cover from ISBN: {} to ISBN: {}", fromIsbn, toIsbn);
    }

    /**
     * The upload body is raw bytes, so the declared Content-Type is all we know about the
     * image. An absent one is treated as JPEG (what the frontend uploads); anything that is
     * not an image type is rejected rather than stored and served back verbatim.
     */
    private String resolveContentType(String contentType) {
        if (contentType == null || contentType.isBlank()) {
            return DEFAULT_CONTENT_TYPE;
        }

        String normalized = contentType.split(";")[0].trim().toLowerCase();
        if (!normalized.startsWith("image/")) {
            throw new BadRequestException("Unsupported cover content type: " + contentType);
        }
        return normalized;
    }
}
