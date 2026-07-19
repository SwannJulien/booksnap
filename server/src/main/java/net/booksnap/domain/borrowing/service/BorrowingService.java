package net.booksnap.domain.borrowing.service;

import net.booksnap.domain.borrowing.api.dto.CreateBorrowingRequest;
import net.booksnap.domain.borrowing.api.dto.CreateBorrowingResponse;
import net.booksnap.domain.borrowing.api.dto.GetBorrowingResponse;

public interface BorrowingService {
    CreateBorrowingResponse createBorrowing(CreateBorrowingRequest createBorrowingRequest);

    GetBorrowingResponse getActiveBorrowingByCopyId(Long copyId);
}
