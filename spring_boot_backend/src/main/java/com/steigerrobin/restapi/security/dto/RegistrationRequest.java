package com.steigerrobin.restapi.security.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


// DTO as security layer beetween request/response and entity
@Getter
@Setter
@ToString
@NoArgsConstructor
public class RegistrationRequest {

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

    @NotBlank(message="Password cannot be empty.")
    @Size(min = 3, max = 40, message="Password needs to contain between 3 and 40 characters.")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,40}$",
        message = "Password must be 8-40 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    )
    private String password;
}
