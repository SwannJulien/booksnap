package net.booksnap.domain.borrowing.service;

import lombok.extern.slf4j.Slf4j;
import net.booksnap.domain.author.Author;
import net.booksnap.domain.book.Book;
import net.booksnap.domain.borrowing.Borrowing;
import net.booksnap.domain.borrowing.Status;
import net.booksnap.domain.borrowing.api.dto.BorrowingResponse;
import net.booksnap.domain.borrowing.api.dto.CreateBorrowingRequest;
import net.booksnap.domain.borrowing.api.dto.CreateBorrowingResponse;
import net.booksnap.domain.borrowing.api.dto.GetBorrowingResponse;
import net.booksnap.domain.borrowing.repository.BorrowingRepository;
import net.booksnap.domain.common.dto.PagedResponse;
import net.booksnap.domain.copy.Copy;
import net.booksnap.domain.copy.repository.CopyRepository;
import net.booksnap.domain.user.User;
import net.booksnap.domain.user.repository.UserRepository;
import net.booksnap.exception.copy.CopyNotAvailableException;
import net.booksnap.exception.copy.CopyNotFoundException;
import net.booksnap.exception.user.UserNotFoundException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BorrowingServiceImpl implements BorrowingService {

    private static final int BORROWING_DURATION_WEEKS = 2;

    private final BorrowingRepository borrowingRepository;
    private final CopyRepository copyRepository;
    private final UserRepository userRepository;

    public BorrowingServiceImpl(BorrowingRepository borrowingRepository,
                                CopyRepository copyRepository,
                                UserRepository userRepository) {
        this.borrowingRepository = borrowingRepository;
        this.copyRepository = copyRepository;
        this.userRepository = userRepository;
    }

    public CreateBorrowingResponse createBorrowing(CreateBorrowingRequest createBorrowingRequest) {
        Copy copy = copyRepository.findById(createBorrowingRequest.copyId())
                .orElseThrow(() -> new CopyNotFoundException(createBorrowingRequest.copyId()));

        if (!copy.getStatus().isBorrowable()) {
            throw new CopyNotAvailableException(copy.getId(), copy.getStatus());
        }

        User user = userRepository.findById(createBorrowingRequest.userId())
                .orElseThrow(() -> new UserNotFoundException(createBorrowingRequest.userId()));

        LocalDate startDate = LocalDate.now();

        Borrowing borrowing = new Borrowing();
        borrowing.setCopy(copy);
        borrowing.setUser(user);
        borrowing.setStatus(Status.borrowed);
        borrowing.setStartDate(startDate);
        borrowing.setEndDate(startDate.plusWeeks(BORROWING_DURATION_WEEKS));

        Borrowing savedBorrowing = borrowingRepository.save(borrowing);

        return new CreateBorrowingResponse(
                savedBorrowing.getId(),
                copy.getId(),
                user.getId(),
                savedBorrowing.getStatus(),
                savedBorrowing.getStartDate(),
                savedBorrowing.getEndDate()
        );
    }

    public GetBorrowingResponse getActiveBorrowingByCopyId(Long copyId) {
        Copy copy = copyRepository.findById(copyId)
                .orElseThrow(() -> new CopyNotFoundException(copyId));

        GetBorrowingResponse.BorrowingDetails borrowingDetails = borrowingRepository
                .findFirstByCopyIdAndStatusIn(copy.getId(), List.of(Status.borrowed, Status.overdue))
                .map(borrowing -> new GetBorrowingResponse.BorrowingDetails(
                        borrowing.getId(),
                        borrowing.getCopy().getId(),
                        borrowing.getUser().getId(),
                        borrowing.getStatus(),
                        borrowing.getStartDate(),
                        borrowing.getEndDate()
                ))
                .orElse(null);

        return new GetBorrowingResponse(copy.getStatus(), copy.getBook().getTitle(), borrowingDetails);
    }

    @Transactional(readOnly = true)
    public PagedResponse<BorrowingResponse> getActiveBorrowings(String q, Status status, Pageable pageable) {
        List<Status> statuses = status != null
                ? List.of(status)
                : List.of(Status.borrowed, Status.overdue);
        String query = q == null ? "" : q.trim();

        return PagedResponse.of(borrowingRepository
                .findByStatusInAndUserMatching(statuses, query, pageable)
                .map(BorrowingServiceImpl::toBorrowingResponse));
    }

    private static BorrowingResponse toBorrowingResponse(Borrowing borrowing) {
        Book book = borrowing.getCopy().getBook();
        User user = borrowing.getUser();

        return new BorrowingResponse(
                borrowing.getId(),
                borrowing.getStatus(),
                borrowing.getStartDate(),
                borrowing.getEndDate(),
                new BorrowingResponse.BookDetails(
                        book.getId(),
                        book.getTitle(),
                        book.getIsbn10(),
                        book.getIsbn13(),
                        book.getAuthors().stream()
                                .map(Author::getName)
                                .collect(Collectors.toSet())),
                new BorrowingResponse.UserDetails(
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail()));
    }
}
