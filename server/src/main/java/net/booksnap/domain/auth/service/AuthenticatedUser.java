package net.booksnap.domain.auth.service;

import lombok.Getter;
import net.booksnap.domain.user.Role;
import net.booksnap.domain.user.User;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class AuthenticatedUser implements UserDetails, CredentialsContainer {
    private final Long id;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final Role role;
    private String passwordHash;   // not final: erased after authentication

    public AuthenticatedUser(User user, String passwordHash) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.role = user.getRole();
        this.passwordHash = passwordHash;
    }


    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name().toUpperCase()));
    }

    @Override public void eraseCredentials() {
        this.passwordHash = null;
    }
}
