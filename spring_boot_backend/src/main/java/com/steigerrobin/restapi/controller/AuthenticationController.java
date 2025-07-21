package com.steigerrobin.restapi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.steigerrobin.restapi.dto.ApiResponse;
import com.steigerrobin.restapi.security.dto.LoginRequest;
import com.steigerrobin.restapi.security.dto.LoginResponse;
import com.steigerrobin.restapi.security.dto.RefreshTokenRequest;
import com.steigerrobin.restapi.security.dto.RefreshTokenResponse;
import com.steigerrobin.restapi.security.dto.RegistrationRequest;
import com.steigerrobin.restapi.security.dto.RegistrationResponse;
import com.steigerrobin.restapi.security.service.AuthenticationService;
import com.steigerrobin.restapi.security.utils.SecurityConstants;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(SecurityConstants.AUTHENTICATION_URI)
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    // Registration ///
    @PostMapping(SecurityConstants.REGISTRATION_REQUEST_URI)
    public ResponseEntity<ApiResponse<RegistrationResponse>> register(@Valid @RequestBody RegistrationRequest request) {
        RegistrationResponse response = authenticationService.register(request);
        ApiResponse<RegistrationResponse> apiResponse = new ApiResponse<>(true, response);
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    // Login ///
    @PostMapping(SecurityConstants.LOGIN_REQUEST_URI)
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authenticationService.loginRequest(request);
        ApiResponse<LoginResponse> apiResponse = new ApiResponse<>(true, response);
        return ResponseEntity.ok(apiResponse);
    }

    // Refresh Token ///
    @PostMapping(SecurityConstants.REFRESH_TOKEN_REQUEST_URI)
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        RefreshTokenResponse response = authenticationService.refreshTokenRequest(request);
        ApiResponse<RefreshTokenResponse> apiResponse = new ApiResponse<>(true, response);
        return ResponseEntity.ok(apiResponse);
    }

    // Logout ///
    @PostMapping(SecurityConstants.LOGOUT_REQUEST_URI)
    public ResponseEntity<ApiResponse<String>> logout() {
        authenticationService.logout();
        ApiResponse<String> apiResponse = new ApiResponse<>(true, "Logout successful");
        return ResponseEntity.ok(apiResponse);
    }
}
