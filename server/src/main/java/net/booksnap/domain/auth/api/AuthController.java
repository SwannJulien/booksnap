package net.booksnap.domain.auth.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import net.booksnap.domain.auth.api.dto.AuthenticatedUserResponse;
import net.booksnap.domain.auth.api.dto.LoginRequest;
import net.booksnap.domain.auth.service.AuthenticatedUser;
import net.booksnap.domain.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@Slf4j
@RestController
@Validated
@RequestMapping("api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final SessionAuthenticationStrategy sessionAuthenticationStrategy;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          SecurityContextRepository securityContextRepository,
                          SessionAuthenticationStrategy sessionAuthenticationStrategy,
                          UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.sessionAuthenticationStrategy = sessionAuthenticationStrategy;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public AuthenticatedUserResponse login(@RequestBody @Valid LoginRequest loginRequest,
                                           HttpServletRequest request,
                                           HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));

        // Rotates the session id, then registers the rotated one. Must run before the
        // context is saved, otherwise the context lands in the session left behind.
        sessionAuthenticationStrategy.onAuthentication(authentication, request, response);

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        // Authenticating by hand no longer persists anything on its own since Spring
        // Security 6. Without this the session is never written, no cookie is set, and
        // /me answers 401 right after a login that returned 200.
        securityContextRepository.saveContext(context, request, response);

        AuthenticatedUser authenticatedUser = (AuthenticatedUser) authentication.getPrincipal();
        recordLastLogin(authenticatedUser.getId());
        log.info("User {} signed in", authenticatedUser.getId());

        return toResponse(authenticatedUser);
    }

    @GetMapping("/me")
    public AuthenticatedUserResponse me(@AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        return toResponse(authenticatedUser);
    }

    /**
     * Side effect to expect: this write also moves the auditing columns of {@code users},
     * now stamped with the email of whoever just signed in.
     */
    private void recordLastLogin(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    private AuthenticatedUserResponse toResponse(AuthenticatedUser authenticatedUser) {
        return new AuthenticatedUserResponse(
                authenticatedUser.getId(),
                authenticatedUser.getFirstName(),
                authenticatedUser.getLastName(),
                authenticatedUser.getEmail(),
                authenticatedUser.getRole());
    }
}
