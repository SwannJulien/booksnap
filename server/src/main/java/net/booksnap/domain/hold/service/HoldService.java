package net.booksnap.domain.hold.service;

import net.booksnap.domain.hold.api.dto.CreateHoldRequest;
import net.booksnap.domain.hold.api.dto.CreateHoldResponse;

public interface HoldService {

    CreateHoldResponse createHold(CreateHoldRequest createHoldRequest);
}
