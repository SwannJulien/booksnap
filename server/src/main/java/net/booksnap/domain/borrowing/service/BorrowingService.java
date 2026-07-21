package net.booksnap.domain.borrowing.service;

import net.booksnap.domain.borrowing.Status;
import net.booksnap.domain.borrowing.api.dto.BorrowingResponse;
import net.booksnap.domain.borrowing.api.dto.CreateBorrowingRequest;
import net.booksnap.domain.borrowing.api.dto.CreateBorrowingResponse;
import net.booksnap.domain.borrowing.api.dto.GetBorrowingResponse;
import net.booksnap.domain.borrowing.api.dto.ReturnBorrowingResponse;
import net.booksnap.domain.common.dto.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface BorrowingService {
    CreateBorrowingResponse createBorrowing(CreateBorrowingRequest createBorrowingRequest);

    ReturnBorrowingResponse returnBorrowing(Long borrowingId);

    GetBorrowingResponse getActiveBorrowingByCopyId(Long copyId);

    PagedResponse<BorrowingResponse> getActiveBorrowings(String q, Status status, Pageable pageable);
}
