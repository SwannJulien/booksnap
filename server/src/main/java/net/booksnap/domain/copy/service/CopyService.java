package net.booksnap.domain.copy.service;

import jakarta.validation.Valid;
import net.booksnap.domain.copy.Copy;
import net.booksnap.domain.copy.api.dto.CopyResponse;
import net.booksnap.domain.copy.api.dto.CreateCopyRequest;
import net.booksnap.domain.copy.api.dto.UpdateCopyRequest;

import java.util.List;

public interface CopyService {
    Copy createCopy(CreateCopyRequest createCopyRequest);

    byte[] generateQRCodeImage(Long copyId);

    Copy findCopyEntityById(Long copyId);

    Object findCopyById(Long copyId, String fields);

    void deleteCopyById(Long copyId);

    void updateCopy(Long copyId, @Valid UpdateCopyRequest request);
}
