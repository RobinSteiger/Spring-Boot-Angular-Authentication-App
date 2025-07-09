package com.steigerrobin.restapi.model;

import java.util.Set;
import java.util.HashSet;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="User")
public class User {

    // Note : Username and email are unique

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Firstname cannot be empty.")
    @Size(min = 3, max = 20, message = "Firstname need to contain between 3 and 20 characters.")
    @Pattern(
        regexp = "^[a-zA-Z]+$",
        message = "Firstname can only contain letters."
    )
    private String firstname;

    @NotBlank(message = "Lastname cannot be empty.")
    @Size(min = 3, max = 20, message = "Lastname need to contain between 3 and 20 characters.")
    @Pattern(
        regexp = "^[a-zA-Z]+$",
        message = "Lastname can only contain letters."
    )
    private String lastname;

    @Column(unique=true)
    @NotBlank(message = "Email cannot be empty.")
    @Size(min = 7, max = 40, message = "Email need to contain between 7 and 40 characters.")
    @Email(message="Email invalid.")
    private String email;

    @Column(unique=true)
    @NotBlank(message="Username cannot be empty.")
    @Size(min = 3, max = 40, message="Username needs to contain between 3 and 40 characters.")
    @Pattern(
        regexp = "^[a-zA-Z0-9._-]{3,40}$",
        message = "Username can only contain letter, numbers, dots, hyphens and underscores."
    )
    private String username;

    // No size constraints because of the encryption of the password
    @NotBlank(message="Password cannot be empty.")
    private String password;

    @ManyToMany
    @JoinTable( name= "user_roles",
                joinColumns= @JoinColumn(name = "user_id"),
                inverseJoinColumns= @JoinColumn(name= "role_id"))
    private Set<UserRole> userRole = new HashSet<>();
}
