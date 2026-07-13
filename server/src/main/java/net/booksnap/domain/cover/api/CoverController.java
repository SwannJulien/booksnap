package net.booksnap.domain.cover.api;

import net.booksnap.domain.cover.service.CoverService;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
                                   @RequestParam String isbn) {
        coverService.uploadCoverImage(imageData, isbn);
    }

    @GetMapping("/{isbn}")
    public byte[] getCoverImageUrl(@PathVariable String isbn) {
        return coverService.getCoverImage(isbn);
    }


}
