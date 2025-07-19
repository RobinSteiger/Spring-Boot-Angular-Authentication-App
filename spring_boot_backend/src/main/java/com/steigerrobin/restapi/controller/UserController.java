package com.steigerrobin.restapi.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.steigerrobin.restapi.dto.UsersDto;
import com.steigerrobin.restapi.dto.ApiResponse;
import com.steigerrobin.restapi.dto.UserDetailsDto;
import com.steigerrobin.restapi.security.utils.SecurityConstants;
import com.steigerrobin.restapi.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(SecurityConstants.USER_URI)
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> allUsers() {
        List<UsersDto> allUsers = userService.getAllUsers();
        ApiResponse<List<UsersDto>> apiResponse = new ApiResponse<>(true, allUsers);
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        UserDetailsDto user = userService.getUser(id);
        ApiResponse<UserDetailsDto> apiResponse = new ApiResponse<>(true, user);
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modifyLigue(@PathVariable Long id, @Valid @RequestBody UserDetailsDto modifiedUser) {
        UserDetailsDto user = userService.modifyUser(id, modifiedUser);
        ApiResponse<UserDetailsDto> apiResponse = new ApiResponse<>(true, user);
        return ResponseEntity.ok(apiResponse);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLigue(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
