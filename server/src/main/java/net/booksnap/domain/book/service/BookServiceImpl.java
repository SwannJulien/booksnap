package net.booksnap.domain.book.service;

import lombok.extern.slf4j.Slf4j;
import net.booksnap.domain.book.Book;
import net.booksnap.domain.book.api.dto.BookResponse;
import net.booksnap.domain.book.api.dto.CreateBookRequest;
import net.booksnap.domain.book.mapper.BookApiMapper;
import net.booksnap.domain.book.repository.BookRepository;
import net.booksnap.domain.common.dto.ListResponse;
import net.booksnap.domain.copy.Copy;
import net.booksnap.domain.copy.api.dto.CopyResponse;
import net.booksnap.domain.copy.mapper.CopyApiMapper;
import net.booksnap.domain.copy.repository.CopyRepository;
import net.booksnap.domain.copy.Status;
import net.booksnap.exception.book.BookNotFoundException;
import net.booksnap.exception.common.BadRequestException;
import net.booksnap.exception.dewey.DeweyCodeNotFoundException;
import net.booksnap.exception.dewey.FictionBookHasDeweyCodeException;
import net.booksnap.domain.library.Library;
import net.booksnap.domain.cover.Cover;
import net.booksnap.utils.qr.QRCodeService;
import net.booksnap.utils.Utils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BookApiMapper bookApiMapper;
    private final CopyRepository copyRepository;
    private final CopyApiMapper copyApiMapper;
    private final QRCodeService qrCodeService;
    private final Utils utils;

    public BookServiceImpl(BookRepository bookRepository,
                           BookApiMapper bookApiMapper,
                           CopyRepository copyRepository,
                           CopyApiMapper copyApiMapper,
                           QRCodeService qrCodeService,
                           Utils utils) {
        this.bookRepository = bookRepository;
        this.bookApiMapper = bookApiMapper;
        this.copyRepository = copyRepository;
        this.copyApiMapper = copyApiMapper;
        this.qrCodeService = qrCodeService;
        this.utils = utils;
    }

    public void addBook(CreateBookRequest createBookRequest) {
        try {
            Book book = bookApiMapper.createRequestToBookEntity(createBookRequest);
            Book savedBook = bookRepository.save(book);

            Copy copy = new Copy();
            copy.setBook(savedBook);
            copy.setLibrary(new Library(createBookRequest.libraryId(), null));
            copy.setStatus(Status.available);
            copy.setCodeIdentification("TEMP"); // Temporary placeholder to satisfy @NotNull
            copy.setCreatedBy(savedBook.getCreatedBy());
            copy.setLastModifiedBy(savedBook.getLastModifiedBy());
            
            Copy savedCopy = copyRepository.save(copy);
            
            // Generate QR code identification after saving to get the ID
            String qrCodeIdentification = qrCodeService.generateCopyIdentificationCode(savedCopy);
            savedCopy.setCodeIdentification(qrCodeIdentification);
            copyRepository.save(savedCopy);
            
        } catch (Exception ex) {
            if (ex.getMessage().contains("non_fiction_requires_dewey")) {
                throw new FictionBookHasDeweyCodeException();
            } else if (ex.getMessage().contains("persistent instance references an unsaved transient instance of 'net.booksnap.entity.dewey.Dewey'")) {
                throw new DeweyCodeNotFoundException(createBookRequest.codeDewey());
            } else throw new BadRequestException(ex.getMessage());
        }
    }

    public BookResponse findBookById(Long bookId) {
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new BookNotFoundException(bookId));
        return bookApiMapper.bookEntityToBookResponse(book);
    }

    public Object findByIdWithFields(Long bookId, String fields) {
        BookResponse bookResponse = findBookById(bookId);
        try {
            return utils.filterFields(bookResponse, fields);
        } catch (Exception e) {
            throw new RuntimeException("Error filtering fields: " + e.getMessage(), e);
        }
    }

    public Page<BookResponse> findAllBooks(Pageable pageable) {
        Page<Book> bookPage = bookRepository.findAll(pageable);
        return bookPage.map(bookApiMapper::bookEntityToBookResponse);
    }

    public ListResponse<CopyResponse> findAllBookCopies(Long bookId) {
        // Validate book exists - will throw BookNotFoundException if not found
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException(bookId));
        log.debug("Finding copies for book: {} - {}", book.getId(), book.getTitle());
        
        List<Copy> copies = copyRepository.findAllByBookId(bookId);
        log.debug("Found {} copies for book ID: {}", copies.size(), bookId);
        
        List<CopyResponse> copyResponses = copies.stream()
                .map(copyApiMapper::copyToResponse)
                .toList();
        
        return new ListResponse<>(copyResponses);
    }

    public void deleteBookById(Long bookId) {
        if (bookRepository.existsById(bookId)){
            bookRepository.deleteById(bookId);
        } else {
            throw new BookNotFoundException(bookId);
        }
    }

    public void updateBook(Long bookId, CreateBookRequest request) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException(bookId));

        // Update existing book properties instead of creating a new entity
        book.setTitle(request.title());
        book.setIsbn10(request.isbn10());
        book.setIsbn13(request.isbn13());
        book.setPublisher(request.publisher());
        book.setPublishingYear(request.publishingYear() != null ? Short.valueOf(request.publishingYear()) : null);
        book.setNumberOfPages((short) request.numberOfPages());
        book.setYearRecommendation(request.yearRecommendation() != null ? Short.valueOf(request.yearRecommendation()) : null);
        book.setIsFiction(request.isFiction());
        
        // Handle relationships through the mapper's after-mapping methods
        bookApiMapper.mapGenresToEntity(book, request);
        bookApiMapper.mapAuthorsToEntity(book, request);
        bookApiMapper.mapDeweyCategory(book, request);
        
        // Update covers: handle existing covers or create new ones
        updateBookCovers(book, request);
        
        bookRepository.save(book);
    }

    private void updateBookCovers(Book book, CreateBookRequest request) {
        if (request.cover() != null && request.cover().link() != null && request.cover().size() != null) {
            // Find existing cover with the same size or create new one
            Cover existingCover = book.getCovers().stream()
                    .filter(cover -> request.cover().size().equals(cover.getSize()))
                    .findFirst()
                    .orElse(null);

            if (existingCover != null) {
                // Update existing cover
                existingCover.setLink(request.cover().link());
            } else {
                // Remove all existing covers and add the new one
                book.getCovers().clear();
                Cover newCover = new Cover();
                newCover.setSize(request.cover().size());
                newCover.setLink(request.cover().link());
                newCover.setBook(book);
                book.getCovers().add(newCover);
            }
        } else {
            // Remove all covers if no cover data provided
            book.getCovers().clear();
        }
    }
}
