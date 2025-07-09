package com.steigerrobin.restapi.security.dto;

import java.util.Set;

import com.steigerrobin.restapi.model.UserRole;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// To recover credentials of an authenticated user, in order to generate jwt token. ///
// Separation of persistence and logic ///

@Getter
@Setter
@NoArgsConstructor
public class AuthenticatedUserDto {
    private String firstname;

    private String lastname;

    private String username;

    private String password;

    private Set<UserRole> userRole;
}
