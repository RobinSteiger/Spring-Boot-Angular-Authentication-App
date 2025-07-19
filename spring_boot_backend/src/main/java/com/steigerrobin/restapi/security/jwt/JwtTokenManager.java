package com.steigerrobin.restapi.security.jwt;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.steigerrobin.restapi.exception.InvalidTokenException;
import com.steigerrobin.restapi.security.dto.AuthenticatedUserDto;
import com.steigerrobin.restapi.utils.MessageAccessor;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtTokenManager {

    private final JwtProperties properties;

    private final MessageAccessor messageAccessor;

    private final String ACCCESS_TOKEN_NOT_FOUND_MESSAGE = "access_token_not_found";


    public String generateToken(AuthenticatedUserDto user) {
        
        final String username = user.getUsername();
        final List<String> roles = user.getUserRole().stream()
            .map(role -> role.getName().name())
            .collect(Collectors.toList());

        return JWT.create()
                    .withSubject(username)
                    .withIssuer(properties.getIssuer())
                    .withClaim("role", roles)
                    .withIssuedAt(new Date())
                    .withExpiresAt(new Date(System.currentTimeMillis() + properties.getExpirationMinute() * 60 * 1000))
                    .sign(Algorithm.HMAC256(properties.getSecretKey().getBytes()));
    }

    // Compare username and expiration time ///
    public boolean validateToken(String token, String authenticatedUsername) {

        final String tokenUsername = getUsernameFromToken(token);

        final boolean sameUsername = tokenUsername.equals(authenticatedUsername);
        final boolean tokenExpired = isTokenExpired(token);

        return sameUsername && !tokenExpired;
    }

    // Verify expiration time ///
    public boolean isTokenExpired(String token) {
        return getDecodedJwt(token).getExpiresAt().before(new Date());
    }

    public String getUsernameFromToken(String token) {
        return getDecodedJwt(token).getSubject();
    }

    // Decode token ///
    public DecodedJWT getDecodedJwt(String token) {
        try {
        final JWTVerifier jwtVerifier = JWT.require(Algorithm.HMAC256(properties.getSecretKey().getBytes())).build();
		return jwtVerifier.verify(token);
        } catch (JWTVerificationException | IllegalArgumentException e) {
            String message = messageAccessor.getMessage(ACCCESS_TOKEN_NOT_FOUND_MESSAGE);
            throw new InvalidTokenException(message, 3000);
        }
    }
    
}
