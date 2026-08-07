package net.booksnap.domain.cover.api;

import net.booksnap.domain.cover.Cover;
import net.booksnap.domain.cover.service.CoverService;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

@RestController
@Validated
@RequestMapping("api/v1/covers")
public class CoverController {

    private final CoverService coverService;

    public CoverController(CoverService coverService) {
        this.coverService = coverService;
    }

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public void uploadCoverImage(@RequestBody byte[] imageData,
                                 @RequestParam String isbn,
                                 @RequestHeader(value = HttpHeaders.CONTENT_TYPE, required = false) String contentType) {
        coverService.uploadCoverImage(imageData, contentType, isbn);
    }

    @GetMapping("/{isbn}")
    public ResponseEntity<byte[]> getCoverImage(@PathVariable String isbn, WebRequest request) {
        Cover cover = coverService.getCoverImage(isbn);

        String eTag = eTagOf(cover);
        if (eTag != null && request.checkNotModified(eTag)) {
            return null;
        }

        ResponseEntity.BodyBuilder response = ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(cover.getContentType()))
                .cacheControl(CacheControl.noCache());

        if (eTag != null) {
            response.eTag(eTag);
        }

        return response.body(cover.getImage());
    }

    @DeleteMapping("/{isbn}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void deleteCoverImage(@PathVariable String isbn) {
        coverService.deleteCoverImage(isbn);
    }

    private String eTagOf(Cover cover) {
        // Rows inserted outside JPA (the one-off BunnyCDN import) may have no audit timestamp.
        return cover.getLastModifiedDate() == null ? null : "\"" + cover.getLastModifiedDate() + "\"";
    }
}
