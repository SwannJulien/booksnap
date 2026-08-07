package net.booksnap.domain.cover;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import net.booksnap.domain.Auditable;

@Entity
@Table(name = "cover")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(exclude = {"image"}, callSuper = false)
@ToString(exclude = {"image"})
public class Cover extends Auditable {

    @Id
    @Column(length = 13)
    private String isbn;

    @Column(name = "image", nullable = false, columnDefinition = "BYTEA")
    private byte[] image;

    @Column(name = "content_type", nullable = false, columnDefinition = "TEXT")
    private String contentType;
}
