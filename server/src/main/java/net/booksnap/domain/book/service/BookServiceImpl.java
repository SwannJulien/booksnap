package net.booksnap.domain.book.service;

import lombok.extern.slf4j.Slf4j;
import net.booksnap.domain.book.Book;
import net.booksnap.domain.book.api.dto.BookResponse;
import net.booksnap.domain.book.api.dto.BookSearchFilter;
import net.booksnap.domain.book.api.dto.CreateBookRequest;
import net.booksnap.domain.book.api.dto.CreateBookResponse;
import net.booksnap.domain.book.mapper.BookApiMapper;
import net.booksnap.domain.book.repository.BookRepository;
import net.booksnap.domain.book.repository.BookSpecifications;
import net.booksnap.exception.book.BookAlreadyExistsException;
import net.booksnap.domain.common.dto.ListResponse;
import net.booksnap.domain.common.dto.PagedResponse;
import net.booksnap.domain.copy.Copy;
import net.booksnap.domain.copy.api.dto.CopyResponse;
import net.booksnap.domain.copy.api.dto.CountCopiesDTO;
import net.booksnap.domain.copy.mapper.CopyApiMapper;
import net.booksnap.domain.copy.repository.CopyRepository;
import net.booksnap.domain.copy.Status;
import net.booksnap.exception.book.BookNotFoundException;
import net.booksnap.exception.common.BadRequestException;
import net.booksnap.exception.dewey.DeweyCodeNotFoundException;
import net.booksnap.exception.dewey.FictionBookHasDeweyCodeException;
import net.booksnap.domain.library.Library;
import net.booksnap.utils.qr.QRCodeService;
import net.booksnap.utils.Utils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    public CreateBookResponse addBook(CreateBookRequest createBookRequest) {
        try {
            checkIfBookAlreadyExists(createBookRequest);

            Book savedBook = createNewBook(createBookRequest);
            Copy savedCopy = createNewCopy(createBookRequest, savedBook);

            // Generate QR code image
            byte[] qrCode = qrCodeService.generateCopyQRCode(savedCopy);

            return new CreateBookResponse(
                qrCode,
                savedCopy.getIdentificationCode(),
                savedCopy.getId(),
                savedBook.getId()
            );

        } catch (BookAlreadyExistsException ex) {
            throw ex; // Re-throw to be handled by GlobalExceptionHandler
        } catch (Exception ex) {
            if (ex.getMessage().contains("non_fiction_requires_dewey")) {
                throw new FictionBookHasDeweyCodeException();
            } else if (ex.getMessage().contains("persistent instance references an unsaved transient instance of 'net.booksnap.entity.dewey.Dewey'")) {
                throw new DeweyCodeNotFoundException(createBookRequest.codeDewey());
            } else throw new BadRequestException(ex.getMessage());
        }
    }

    private Book createNewBook(CreateBookRequest createBookRequest) {
        Book book = bookApiMapper.createRequestToBookEntity(createBookRequest);
        Book savedBook = bookRepository.save(book);
        return savedBook;
    }

    private Copy createNewCopy(CreateBookRequest createBookRequest, Book savedBook) {
        Copy copy = new Copy();
        copy.setBook(savedBook);
        copy.setLibrary(new Library(createBookRequest.libraryId(), null));
        copy.setStatus(Status.available);
        copy.setSectionName(createBookRequest.sectionName());

        // Generate identification code from section name and first author's surname
        String identificationCode = qrCodeService.generateIdentificationCode(
            createBookRequest.sectionName(),
            createBookRequest.authors()
        );
        copy.setIdentificationCode(identificationCode);

        copy.setCreatedBy(savedBook.getCreatedBy());
        copy.setLastModifiedBy(savedBook.getLastModifiedBy());

        Copy savedCopy = copyRepository.save(copy);
        return savedCopy;
    }

    private void checkIfBookAlreadyExists(CreateBookRequest createBookRequest) {
        // Check if book already exists by ISBN10, ISBN13, or title
        if (createBookRequest.isbn10() != null && !createBookRequest.isbn10().isEmpty()) {
            bookRepository.findByIsbn10(createBookRequest.isbn10())
                .ifPresent(book -> {
                    throw new BookAlreadyExistsException("ISBN-10: " + createBookRequest.isbn10(), book.getId());
                });
        }

        if (createBookRequest.isbn13() != null && !createBookRequest.isbn13().isEmpty()) {
            bookRepository.findByIsbn13(createBookRequest.isbn13())
                .ifPresent(book -> {
                    throw new BookAlreadyExistsException("ISBN-13: " + createBookRequest.isbn13(), book.getId());
                });
        }

        bookRepository.findByTitleIgnoreCase(createBookRequest.title())
            .ifPresent(book -> {
                throw new BookAlreadyExistsException("Title: " + createBookRequest.title(), book.getId());
            });
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
        book.setYearRecommendation(request.yearRecommendation());
        book.setIsFiction(request.isFiction());

        // Handle relationships through the mapper's after-mapping methods
        bookApiMapper.mapGenresToEntity(book, request);
        bookApiMapper.mapAuthorsToEntity(book, request);
        bookApiMapper.mapDeweyCategory(book, request);

        bookRepository.save(book);
    }

    public PagedResponse<BookResponse> searchBooks(BookSearchFilter filter, Pageable pageable) {
        Specification<Book> spec = Specification.where(null);

        if (filter.q() != null && filter.q().trim().length() >= 2) {
            spec = spec.and(BookSpecifications.textSearch(filter.q().trim()));
        }

        if (filter.genres() != null && !filter.genres().isEmpty()) {
            spec = spec.and(BookSpecifications.hasGenres(filter.genres()));
        }

        if (filter.copyStatuses() != null && !filter.copyStatuses().isEmpty()) {
            spec = spec.and(BookSpecifications.hasCopyWithStatus(filter.copyStatuses()));
        }

        if (filter.keyStage() != null) {
            spec = spec.and(BookSpecifications.hasKeyStage(filter.keyStage()));
        }

        // Use distinct to avoid duplicates from joins
        Specification<Book> distinctSpec = spec;
        spec = (root, cq, cb) -> {
            cq.distinct(true);
            return distinctSpec.toPredicate(root, cq, cb);
        };

        Page<Book> bookPage = bookRepository.findAll(spec, pageable);

        // Batch-load copy counts to avoid N+1
        List<Long> bookIds = bookPage.getContent().stream().map(Book::getId).toList();
        Map<Long, CountCopiesDTO> copyCounts = batchLoadCopyCounts(bookIds);

        Page<BookResponse> responsePage = bookPage.map(book -> {
            BookResponse response = bookApiMapper.bookEntityToBookResponse(book);
            CountCopiesDTO counts = copyCounts.getOrDefault(book.getId(), new CountCopiesDTO(0, 0));
            return new BookResponse(
                    response.id(), response.title(), response.isbn10(), response.isbn13(),
                    response.publishingYear(), response.publisher(), response.numberOfPages(),
                    response.yearRecommendation(), response.isFiction(), response.codeDewey(),
                    response.genres(), response.authors(), counts, response.audit()
            );
        });

        return PagedResponse.of(responsePage);
    }

    private Map<Long, CountCopiesDTO> batchLoadCopyCounts(List<Long> bookIds) {
        if (bookIds.isEmpty()) {
            return Collections.emptyMap();
        }
        return copyRepository.countCopiesByBookIds(bookIds, Status.available).stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> new CountCopiesDTO((Long) row[1], (Long) row[2])
                ));
    }
}
