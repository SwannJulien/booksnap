package net.booksnap.domain.genre;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/genres")
public class GenreController {

    private final GenreRepository genreRepository;

    public GenreController(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    @GetMapping("/search")
    public List<String> searchGenres(
            @RequestParam String q,
            @RequestParam(defaultValue = "10") int limit) {
        return genreRepository.findByNameContainingIgnoreCase(q).stream()
                .map(Genre::getName)
                .limit(limit)
                .toList();
    }
}
