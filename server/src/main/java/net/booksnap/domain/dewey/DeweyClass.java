package net.booksnap.domain.dewey;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dewey_class")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeweyClass {
    @Id
    @Column(name = "code", unique = true, nullable = false)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;
}
