package net.booksnap.domain.dewey;

import net.booksnap.domain.dewey.api.dto.DeweyDTO;
import net.booksnap.domain.dewey.service.DeweyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/dewey")
public class DeweyController {

    private final DeweyService deweyService;

    public DeweyController(DeweyService deweyService) {
        this.deweyService = deweyService;
    }

    @GetMapping("/classes")
    public List<DeweyDTO> getAllClasses() {
        return deweyService.getAllClasses();
    }

    @GetMapping("/classes/{classCode}/divisions")
    public List<DeweyDTO> getDivisionsByClass(@PathVariable String classCode) {
        return deweyService.getDivisionsByClassCode(classCode);
    }

    @GetMapping("/divisions/{divisionCode}/categories")
    public List<DeweyDTO> getCategoriesByDivision(@PathVariable String divisionCode) {
        return deweyService.getCategoriesByDivisionCode(divisionCode);
    }
}
