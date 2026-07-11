package net.booksnap.domain.copy.api;

import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;
import net.booksnap.domain.copy.Copy;
import net.booksnap.domain.copy.api.dto.CopyResponse;
import net.booksnap.domain.copy.api.dto.CreateCopyRequest;
import net.booksnap.domain.copy.api.dto.UpdateCopyRequest;
import net.booksnap.domain.copy.service.CopyService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@Validated
@RequestMapping("api/v1/copies")
public class CopyController {

    private final CopyService copyService;

    public CopyController(CopyService copyService) {
        this.copyService = copyService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createCopy(@RequestBody @Valid CreateCopyRequest createCopyRequest) {
         copyService.createCopy(createCopyRequest);
    }

    @GetMapping("/{copyId}")
    public Object getCopy(@PathVariable Long copyId, 
                         @RequestParam(required = false) String fields) {
        return copyService.findCopyById(copyId, fields);
    }

    @GetMapping("/{copyId}/qrcode")
    public ResponseEntity<byte[]> getCopyQRCode(@PathVariable Long copyId) {
        byte[] qrCodeImage = copyService.generateQRCodeImage(copyId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentDisposition(ContentDisposition.inline()
            .filename("copy-" + copyId + "-qr.png").build());

        return ResponseEntity.ok()
            .headers(headers)
            .body(qrCodeImage);
    }

    @DeleteMapping("/{copyId}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void deleteCopy(@PathVariable Long copyId){
        copyService.deleteCopyById(copyId);
    }

    @PutMapping("/{copyId}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void updateCopy(@PathVariable Long copyId,
                           @RequestBody @Valid UpdateCopyRequest request) {

        copyService.updateCopy(copyId, request);
    }
}