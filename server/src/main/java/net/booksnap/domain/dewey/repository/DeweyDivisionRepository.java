package net.booksnap.domain.dewey.repository;

import net.booksnap.domain.dewey.DeweyDivision;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeweyDivisionRepository extends JpaRepository<DeweyDivision, String> {
    List<DeweyDivision> findByDeweyClassCode(String classCode);
}
