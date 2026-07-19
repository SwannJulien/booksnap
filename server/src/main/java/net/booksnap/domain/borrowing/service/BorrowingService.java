package net.booksnap.domain.borrowing.service;

import net.booksnap.domain.borrowing.api.dto.CreateBorrowingRequest;
import net.booksnap.domain.borrowing.api.dto.CreateBorrowingResponse;

public interface BorrowingService {
    CreateBorrowingResponse createBorrowing(CreateBorrowingRequest createBorrowingRequest);
}
