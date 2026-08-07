package net.booksnap.domain.cover.repository;

import net.booksnap.domain.cover.Cover;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoverRepository extends JpaRepository<Cover, String> {
}
