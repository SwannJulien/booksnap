package net.booksnap.domain.borrowing.api;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import net.booksnap.domain.borrowing.api.dto.CreateBorrowingRequest;
import net.booksnap.domain.borrowing.api.dto.CreateBorrowingResponse;
import net.booksnap.domain.borrowing.api.dto.GetBorrowingResponse;
import net.booksnap.domain.borrowing.service.BorrowingService;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@Validated
@RequestMapping("api/v1/borrowings")
public class BorrowingController {

    private final BorrowingService borrowingService;

    public BorrowingController(BorrowingService borrowingService) {
        this.borrowingService = borrowingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateBorrowingResponse createBorrowing(@RequestBody @Valid CreateBorrowingRequest createBorrowingRequest) {
        return borrowingService.createBorrowing(createBorrowingRequest);
    }

    @GetMapping("/{copyId}")
    public GetBorrowingResponse getBorrowingByCopyId(@PathVariable Long copyId) {
        return borrowingService.getActiveBorrowingByCopyId(copyId);
    }
}
