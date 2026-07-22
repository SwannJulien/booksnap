package net.booksnap.domain.hold.api;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import net.booksnap.domain.common.dto.PagedResponse;
import net.booksnap.domain.hold.Status;
import net.booksnap.domain.hold.api.dto.CreateHoldRequest;
import net.booksnap.domain.hold.api.dto.CreateHoldResponse;
import net.booksnap.domain.hold.api.dto.HoldResponse;
import net.booksnap.domain.hold.service.HoldService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Validated
@RequestMapping("api/v1/holds")
public class HoldController {

    private final HoldService holdService;

    public HoldController(HoldService holdService) {
        this.holdService = holdService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateHoldResponse createHold(@RequestBody @Valid CreateHoldRequest createHoldRequest) {
        return holdService.createHold(createHoldRequest);
    }

    // Sorted by createdDate: for holds that is the queue, oldest waiting first
    @GetMapping
    public PagedResponse<HoldResponse> getHolds(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Status status,
            @PageableDefault(size = 10, sort = "createdDate") Pageable pageable) {
        return holdService.getHolds(q, status, pageable);
    }
}
