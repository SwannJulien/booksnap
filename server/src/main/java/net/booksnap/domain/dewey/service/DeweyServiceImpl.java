package net.booksnap.domain.dewey.service;

import net.booksnap.domain.dewey.repository.DeweyCategoryRepository;
import net.booksnap.domain.dewey.repository.DeweyClassRepository;
import net.booksnap.domain.dewey.api.dto.DeweyDTO;
import net.booksnap.domain.dewey.repository.DeweyDivisionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeweyServiceImpl implements DeweyService {

    private final DeweyClassRepository classRepository;
    private final DeweyDivisionRepository divisionRepository;
    private final DeweyCategoryRepository categoryRepository;

    public DeweyServiceImpl(DeweyClassRepository classRepository,
                            DeweyDivisionRepository divisionRepository,
                            DeweyCategoryRepository categoryRepository) {
        this.classRepository = classRepository;
        this.divisionRepository = divisionRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<DeweyDTO> getAllClasses() {
        return classRepository.findAll().stream()
                .map(c -> new DeweyDTO(c.getCode(), c.getName()))
                .toList();
    }

    @Override
    public List<DeweyDTO> getDivisionsByClassCode(String classCode) {
        return divisionRepository.findByDeweyClassCode(classCode).stream()
                .map(d -> new DeweyDTO(d.getCode(), d.getName()))
                .toList();
    }

    @Override
    public List<DeweyDTO> getCategoriesByDivisionCode(String divisionCode) {
        return categoryRepository.findByDivisionCode(divisionCode).stream()
                .map(c -> new DeweyDTO(c.getCode(), c.getName()))
                .toList();
    }
}
