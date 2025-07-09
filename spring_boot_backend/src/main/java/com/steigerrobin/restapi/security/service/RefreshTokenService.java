package com.steigerrobin.restapi.security.service;

import java.util.Date;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.steigerrobin.restapi.model.RefreshToken;
import com.steigerrobin.restapi.repository.RefreshTokenRepository;
import com.steigerrobin.restapi.repository.UserRepository;
import com.steigerrobin.restapi.security.jwt.JwtProperties;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final JwtProperties properties;

    private final RefreshTokenRepository refreshTokenRepository;

    private final UserRepository userRepository;

    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional
    public RefreshToken createRefreshToken(String username) {
        // Delete old token ///
        deleteByUsername(username);
        refreshTokenRepository.flush();

        RefreshToken token = new RefreshToken();
        token.setUser(userRepository.findByUsername(username));
        token.setExpiryDate(new Date(System.currentTimeMillis() + properties.getRefreshExpirationMinute() * 60 * 1000));
        token.setToken(UUID.randomUUID().toString());

        token = refreshTokenRepository.save(token);
        return token;
    }

    public boolean isExpired(RefreshToken token) {
        return token.getExpiryDate().before(new Date());
    }

    @Transactional
    public boolean deleteByUsername(String username) {
        return refreshTokenRepository.deleteByUser(userRepository.findByUsername(username)) > 0;
    }
}
