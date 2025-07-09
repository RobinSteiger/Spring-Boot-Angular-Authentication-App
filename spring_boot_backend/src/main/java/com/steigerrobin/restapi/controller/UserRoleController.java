package com.steigerrobin.restapi.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.steigerrobin.restapi.dto.ApiResponse;
import com.steigerrobin.restapi.model.UserRole;
import com.steigerrobin.restapi.security.utils.SecurityConstants;
import com.steigerrobin.restapi.service.UserRoleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(SecurityConstants.USER_ROLE_URI)
@RequiredArgsConstructor
public class UserRoleController {
    private final UserRoleService userRoleService;

    @GetMapping
    public ResponseEntity<?> allUsers() {
        List<UserRole> allRole = userRoleService.getAllUserRole();
        ApiResponse<List<UserRole>> apiResponse = new ApiResponse<>(true, allRole);
        return ResponseEntity.ok(apiResponse);
    }
}
