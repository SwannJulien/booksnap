package net.booksnap.domain.dewey;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dewey_division")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeweyDivision {
    @Id
    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "class_code", referencedColumnName = "code", nullable = false)
    private DeweyClass deweyClass;
}
