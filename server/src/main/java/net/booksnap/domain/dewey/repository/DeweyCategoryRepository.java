package net.booksnap.domain.dewey.repository;

import net.booksnap.domain.dewey.DeweyCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeweyCategoryRepository extends JpaRepository<DeweyCategory, String> {
    Optional<DeweyCategory> findByCode(String code);
    List<DeweyCategory> findByDivisionCode(String divisionCode);
}
