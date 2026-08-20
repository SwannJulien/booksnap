package net.booksnap.domain.auth;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import net.booksnap.domain.Auditable;
import net.booksnap.domain.user.User;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(name ="auth_identity")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AuthIdentity extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider")
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @NotNull
    private Provider provider;

    @Column(name = "subject")
    private String subject;

    @Column(name = "password_hash")
    @ToString.Exclude
    private String passwordHash;
}
