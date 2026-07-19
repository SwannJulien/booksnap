package net.booksnap.domain.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import net.booksnap.domain.Auditable;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class User extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "is_super")
    private Boolean isSuper;

    @Column(name = "email", nullable = false, unique = true)
    @Email
    @NotNull
    private String email;

    @Column(name = "is_active")
    private Boolean isActive = Boolean.TRUE;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

}
