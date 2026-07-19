package net.booksnap.domain.user.api;

import net.booksnap.domain.user.api.dto.UserSearchResponse;
import net.booksnap.domain.user.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/search")
    public List<UserSearchResponse> searchUsers(
            @RequestParam String q,
            @RequestParam(defaultValue = "10") int limit) {
        return userRepository.searchActiveUsers(q).stream()
                .map(user -> new UserSearchResponse(
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail()))
                .limit(limit)
                .toList();
    }
}
