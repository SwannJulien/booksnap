package net.booksnap.domain.copy.service;

import lombok.extern.slf4j.Slf4j;
import net.booksnap.domain.book.Book;
import net.booksnap.domain.book.repository.BookRepository;
import net.booksnap.domain.copy.Copy;
import net.booksnap.domain.copy.api.dto.CreateCopyRequest;
import net.booksnap.domain.copy.api.dto.UpdateCopyRequest;
import net.booksnap.domain.copy.api.dto.CopyResponse;
import net.booksnap.domain.copy.mapper.CopyApiMapper;
import net.booksnap.domain.copy.repository.CopyRepository;
import net.booksnap.exception.book.BookNotFoundException;
import net.booksnap.exception.copy.CopyNotFoundException;
import net.booksnap.domain.library.Library;
import net.booksnap.utils.qr.QRCodeService;
import net.booksnap.utils.Utils;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class CopyServiceImpl implements CopyService {

    private final CopyRepository copyRepository;
    private final BookRepository bookRepository;
    private final QRCodeService qrCodeService;
    private final CopyApiMapper copyApiMapper;
    private final Utils utils;

    public CopyServiceImpl(CopyRepository copyRepository,
                           BookRepository bookRepository,
                           QRCodeService qrCodeService,
                           CopyApiMapper copyApiMapper,
                           Utils utils) {
        this.copyRepository = copyRepository;
        this.bookRepository = bookRepository;
        this.qrCodeService = qrCodeService;
        this.copyApiMapper = copyApiMapper;
        this.utils = utils;
    }

    public Copy createCopy(CreateCopyRequest createCopyRequest) {
        Book book = bookRepository.findById(createCopyRequest.bookId())
            .orElseThrow(() -> new BookNotFoundException(createCopyRequest.bookId()));

        Copy copy = new Copy();
        copy.setBook(book);
        copy.setLibrary(new Library(createCopyRequest.libraryId(), null));
        copy.setStatus(createCopyRequest.status());
        copy.setCodeIdentification("TEMP"); // Temporary placeholder to satisfy @NotNull

        Copy savedCopy = copyRepository.save(copy);

        // Generate QR code identification after saving to get the ID
        String qrCodeIdentification = qrCodeService.generateCopyIdentificationCode(savedCopy);
        savedCopy.setCodeIdentification(qrCodeIdentification);
        
        return copyRepository.save(savedCopy);
    }

    public byte[] generateQRCodeImage(Long copyId) {
        Copy copy = findCopyEntityById(copyId);
        return qrCodeService.generateCopyQRCode(copy);
    }

    public Object findCopyById(Long copyId, String fields) {
        Copy copy = copyRepository.findById(copyId)
            .orElseThrow(() -> new CopyNotFoundException(copyId));
        CopyResponse copyResponse = copyApiMapper.copyToResponse(copy);


        if (fields == null || fields.trim().isEmpty()) {
            return copyResponse;
        }
        
        try {
            return utils.filterFields(copyResponse, fields);
        } catch (Exception e) {
            throw new RuntimeException("Error filtering fields: " + e.getMessage(), e);
        }
    }

    public Copy findCopyEntityById(Long copyId) {
        return copyRepository.findById(copyId)
            .orElseThrow(() -> new RuntimeException("Copy not found with ID: " + copyId));
    }

    public void deleteCopyById(Long copyId) {
        if (copyRepository.existsById(copyId)){
            copyRepository.deleteById(copyId);
        } else {
            throw new CopyNotFoundException(copyId);
        }
    }

    public void updateCopy(Long copyId, UpdateCopyRequest request) {
        Copy existingCopy = copyRepository.findById(copyId)
            .orElseThrow(() -> new CopyNotFoundException(copyId));

        if (request.libraryId() != null) {
            existingCopy.setLibrary(new Library(request.libraryId(), null));
        }
        existingCopy.setStatus(request.status());

        copyRepository.save(existingCopy);
    }
}