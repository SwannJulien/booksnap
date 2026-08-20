package net.booksnap.domain.auth.repository;

import net.booksnap.domain.auth.AuthIdentity;
import net.booksnap.domain.auth.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthIdentityRepository extends JpaRepository<AuthIdentity, Long> {
    Optional<AuthIdentity> findByProviderAndSubject(Provider provider, String subject);
    Optional<AuthIdentity> findByUserIdAndProvider(Long userId, Provider provider);
}
