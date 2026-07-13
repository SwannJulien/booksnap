package net.booksnap.domain.dewey.service;

import net.booksnap.domain.dewey.api.dto.DeweyDTO;

import java.util.List;

public interface DeweyService {
    List<DeweyDTO> getAllClasses();
    List<DeweyDTO> getDivisionsByClassCode(String classCode);
    List<DeweyDTO> getCategoriesByDivisionCode(String divisionCode);
}
