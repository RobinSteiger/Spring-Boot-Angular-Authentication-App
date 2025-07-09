package com.steigerrobin.restapi.dto;

import java.util.Set;

import com.steigerrobin.restapi.model.UserRole;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

// Return All User Credentials for Admin gestion ///

@Getter
@Setter
@AllArgsConstructor
public class UserDetailsDto {
    private Long id;

    private String username;

    private Set<UserRole> userRole;

    private String firstname;

    private String lastname;

    private String email;
    
}
