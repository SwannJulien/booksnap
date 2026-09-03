package net.booksnap.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.authentication.session.ChangeSessionIdAuthenticationStrategy;
import org.springframework.security.web.authentication.session.CompositeSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfAuthenticationStrategy;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestHandler;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.security.web.session.SessionInformationExpiredStrategy;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           AuthenticationEntryPoint authenticationEntryPoint,
                                           AccessDeniedHandler accessDeniedHandler,
                                           CsrfTokenRepository csrfTokenRepository,
                                           CsrfTokenRequestHandler csrfTokenRequestHandler,
                                           SessionRegistry sessionRegistry,
                                           SessionInformationExpiredStrategy sessionInformationExpiredStrategy) throws Exception {
        http
            .cors(Customizer.withDefaults())
            // Enabled since US-006. Authentication is carried by a cookie the browser
            // attaches on its own, including on a request another site triggered, so a
            // write has to prove it was issued by our own pages. Spring Security exempts
            // GET, HEAD, OPTIONS and TRACE by itself — reads stay untouched.
            .csrf(csrf -> csrf
                    .csrfTokenRepository(csrfTokenRepository)
                    .csrfTokenRequestHandler(csrfTokenRequestHandler)
            )
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/v1/auth/csrf", "/api/v1/auth/login", "/api/v1/auth/logout").permitAll()
                    .requestMatchers("/api/v1/auth/me", "/api/v1/auth/password").authenticated()
                    .anyRequest().permitAll()
            )
            // Not a limit on how many times someone may sign in — maximumSessions(-1) is
            // unlimited, and capping the librarians' browsers is nobody's requirement.
            // Declaring concurrency control is what puts ConcurrentSessionFilter in the
            // chain, and that filter is the only thing that acts on a session marked
            // expired by SessionInvalidator. Without this block, changing a password marks
            // the other sessions and they keep working regardless.
            .sessionManagement(session -> session
                    .maximumSessions(-1)
                    .sessionRegistry(sessionRegistry)
                    .expiredSessionStrategy(sessionInformationExpiredStrategy)
            )
            .exceptionHandling(exception -> exception
                    .authenticationEntryPoint(authenticationEntryPoint)
                    .accessDeniedHandler(accessDeniedHandler)
            )
            .logout(logout -> logout
                    .logoutUrl("/api/v1/auth/logout")
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID")
                    .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.NO_CONTENT))
            );
        return http.build();
    }

    /**
     * The token lives in a cookie the script is allowed to read, not in the session.
     *
     * <p>That is the deliberate opposite of {@code JSESSIONID}, which stays {@code HttpOnly}:
     * the front end must be able to copy the CSRF token into a request header, and the
     * whole protection rests on a foreign site being unable to read our cookies. Making
     * the session cookie readable would hand it to any injected script; making the CSRF
     * cookie unreadable would leave the front end nothing to send.
     *
     * <p>Storing it in a cookie rather than the session also means a token can be handed
     * out before anyone has signed in — which is what lets the login form itself be
     * protected.
     */
    @Bean
    public CsrfTokenRepository csrfTokenRepository() {
        return CookieCsrfTokenRepository.withHttpOnlyFalse();
    }

    @Bean
    public CsrfTokenRequestHandler csrfTokenRequestHandler() {
        return new SpaCsrfTokenRequestHandler();
    }

    @Bean
    public PasswordEncoder passwordEncoder(@Value("${booksnap.security.bcrypt-strength:10}") int strength) {
        return new BCryptPasswordEncoder(strength);
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    // Order matters: the session id is rotated first, so the registry records the
    // rotated one rather than the id the client arrived with.
    //
    // The CSRF step comes last and is not decoration: it throws away the token the
    // visitor held before signing in and issues a new one. Whoever managed to plant a
    // known token in the browser before the login therefore holds a dead value after it.
    // Spring wires this strategy in on its own when the login goes through one of its
    // filters; AuthController authenticates by hand, so it has to be listed here.
    @Bean
    public SessionAuthenticationStrategy sessionAuthenticationStrategy(SessionRegistry sessionRegistry,
                                                                      CsrfTokenRepository csrfTokenRepository,
                                                                      CsrfTokenRequestHandler csrfTokenRequestHandler) {
        CsrfAuthenticationStrategy csrfAuthenticationStrategy = new CsrfAuthenticationStrategy(csrfTokenRepository);
        csrfAuthenticationStrategy.setRequestHandler(csrfTokenRequestHandler);

        return new CompositeSessionAuthenticationStrategy(List.of(
                new ChangeSessionIdAuthenticationStrategy(),
                new RegisterSessionAuthenticationStrategy(sessionRegistry),
                csrfAuthenticationStrategy
        ));
    }

    // Without it the registry never hears about expired or invalidated sessions and
    // keeps growing.
    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }
}
