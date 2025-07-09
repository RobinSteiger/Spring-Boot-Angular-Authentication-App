package com.steigerrobin.restapi.dto;

import java.util.Set;

import com.steigerrobin.restapi.model.UserRole;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AllUsersDto {
    private Long id;

    private String username;

    private Set<UserRole> userRole;
}
