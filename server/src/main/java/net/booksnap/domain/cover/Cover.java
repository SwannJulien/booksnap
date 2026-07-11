package net.booksnap.domain.cover;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import net.booksnap.domain.Auditable;
import net.booksnap.domain.book.Book;

@Entity
@Table(name = "cover")
@IdClass(CoverId.class)
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(exclude = "book", callSuper = false)
@ToString(exclude = "book")
public class Cover extends Auditable {

    @Id
    @Column(name = "book_id")
    private Long bookId;

    @Id
    private String size;

    private String link;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", insertable = false, updatable = false)
    private Book book;

    @PrePersist
    @PreUpdate
    private void updateBookId() {
        if (this.book != null) {
            this.bookId = this.book.getId();
        }
    }
}
