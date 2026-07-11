package net.booksnap.domain.dewey;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dewey_category")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeweyCategory {
    @Id
    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "division_code", nullable = false)
    private DeweyDivision division;
}