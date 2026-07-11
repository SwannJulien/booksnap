package net.booksnap.domain.dewey;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeweyCategoryRepository extends JpaRepository<DeweyCategory, Long> {
    Optional<DeweyCategory> findByCode(String code);
}
