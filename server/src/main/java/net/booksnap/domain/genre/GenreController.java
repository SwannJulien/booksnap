package net.booksnap.domain.genre;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/genres")
public class GenreController {

    @PostMapping
    public void addNewGenre(Genre genre) {
        System.out.println("Adding new genre: " + genre.getName());
    }
}
