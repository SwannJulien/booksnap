package net.booksnap.domain.borrowing.service;

import lombok.extern.slf4j.Slf4j;
import net.booksnap.domain.borrowing.Borrowing;
import net.booksnap.domain.borrowing.Status;
import net.booksnap.domain.borrowing.api.dto.CreateBorrowingRequest;
import net.booksnap.domain.borrowing.api.dto.CreateBorrowingResponse;
import net.booksnap.domain.borrowing.repository.BorrowingRepository;
import net.booksnap.domain.copy.Copy;
import net.booksnap.domain.copy.repository.CopyRepository;
import net.booksnap.domain.user.User;
import net.booksnap.domain.user.repository.UserRepository;
import net.booksnap.exception.copy.CopyNotFoundException;
import net.booksnap.exception.user.UserNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

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
}
