package com.steigerrobin.restapi.security.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// DTO as security layer beetween request/response and entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationResponse {

    private String accessToken;

    private String refreshToken;

    private String message;

}