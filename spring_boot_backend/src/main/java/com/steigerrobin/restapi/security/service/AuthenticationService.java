package com.steigerrobin.restapi.security.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.steigerrobin.restapi.exception.InvalidTokenException;
import com.steigerrobin.restapi.exception.RegistrationException;
import com.steigerrobin.restapi.mapper.UserMapper;
import com.steigerrobin.restapi.model.EnumUserRole;
import com.steigerrobin.restapi.model.RefreshToken;
import com.steigerrobin.restapi.model.User;
import com.steigerrobin.restapi.model.UserRole;
import com.steigerrobin.restapi.repository.UserRepository;
import com.steigerrobin.restapi.repository.UserRoleRepository;
import com.steigerrobin.restapi.security.dto.AuthenticatedUserDto;
import com.steigerrobin.restapi.security.dto.LoginRequest;
import com.steigerrobin.restapi.security.dto.LoginResponse;
import com.steigerrobin.restapi.security.dto.RefreshTokenRequest;
import com.steigerrobin.restapi.security.dto.RefreshTokenResponse;
import com.steigerrobin.restapi.security.dto.RegistrationRequest;
import com.steigerrobin.restapi.security.dto.RegistrationResponse;
import com.steigerrobin.restapi.security.jwt.JwtTokenManager;
import com.steigerrobin.restapi.utils.MessageAccessor;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final UserRepository userRepository;

    private final UserRoleRepository userRoleRepository;

    // Registration ///

    // Password encoder
    private final PasswordEncoder passwordEncoder;
    // Message accessor
    private final MessageAccessor messageAccessor;
    // Message name
    private final String USERNAME_EXCEPTION_MESSAGE = "registration_username_already_exists";
    private final String EMAIL_EXCEPTION_MESSAGE = "registration_email_already_exists";
    private final String REGISTRATION_SUCCESSFUL = "registration_successful";

    // Login ///

    // Authentication
    private final AuthenticationManager authenticationManager;
    // Jwt token manager
    private final JwtTokenManager jwtTokenManager;
    // Refresh Token service
    private final RefreshTokenService refreshTokenService;
    // Message name
    private final String REFRESH_TOKEN_NOT_FOUND_MESSAGE = "refresh_token_not_found";
    private final String REFRESH_TOKEN_EXPIRED_MESSAGE = "refresh_token_expired";




    // REGISTRATION ///
    @Transactional
    public RegistrationResponse register(RegistrationRequest request) {
        // Check unique
        validateUser(request);
        // Map DTO to User instance
        final User user = UserMapper.INSTANCE.convertToUser(request);
        // Hash password for storage
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Define role
        UserRole roleUser = userRoleRepository.findByName(EnumUserRole.ROLE_USER);
        user.setUserRole(new HashSet<>(Set.of(roleUser)));

        userRepository.save(user);
            
        // Return successful registration with token 
        final String username = user.getUsername();
        final String jwtToken = jwtTokenManager.generateToken(findAuthenticatedUserByUsername(username));
        final RefreshToken refreshToken = refreshTokenService.createRefreshToken(username);
        
        final String successRegistrationMessage = messageAccessor.getMessage(REGISTRATION_SUCCESSFUL, username);  
        log.info(successRegistrationMessage);
        return new RegistrationResponse(jwtToken, refreshToken.getToken(), successRegistrationMessage);
    }

    // LOGIN ///
    public LoginResponse loginRequest(LoginRequest loginRequest) {
        
        final String username = loginRequest.getUsername();
        final String password = loginRequest.getPassword();
        // Token for authentication
        final UsernamePasswordAuthenticationToken authenticationToken = 
            new UsernamePasswordAuthenticationToken(username, password);
        // Throw exception if incorrect
        authenticationManager.authenticate(authenticationToken);

        // Jwt token generation using a dto
        final AuthenticatedUserDto authenticatedUserDto = findAuthenticatedUserByUsername(username);
        final String token = jwtTokenManager.generateToken(authenticatedUserDto);
        // Refresh token
        final RefreshToken refreshToken = refreshTokenService.createRefreshToken(username);

        log.info("{} has successfully logged in!", username);
        return new LoginResponse(token, refreshToken.getToken());

    }

    public RefreshTokenResponse refreshTokenRequest(RefreshTokenRequest refreshRequest) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshRequest.getRefreshToken());
       
        // Exception gestion ///

        if (refreshToken == null) {
            String message = messageAccessor.getMessage(REFRESH_TOKEN_NOT_FOUND_MESSAGE);
            log.warn(message);
            throw new InvalidTokenException(message, 3001);
        }

        if (refreshTokenService.isExpired(refreshToken)) {
            String message = messageAccessor.getMessage(REFRESH_TOKEN_EXPIRED_MESSAGE);
            log.warn(message);
            throw new InvalidTokenException(message, 3003);
        }

        final String username = refreshToken.getUser().getUsername();
        final String jwtToken = jwtTokenManager.generateToken(findAuthenticatedUserByUsername(username));
        // Rotation of refresh token ///
        refreshToken = refreshTokenService.createRefreshToken(username);
        
        return new RefreshTokenResponse(jwtToken, refreshToken.getToken());
    }

    public void logout() {
        final UserDetails auth = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        refreshTokenService.deleteByUsername(auth.getUsername());
    }

    // UTILS ///

    // Validate data ///
    public void validateUser(RegistrationRequest request) {

        final String username = request.getUsername();
        final String email = request.getEmail();

        // Verify unique constraints
        checkUsername(username);
        checkEmail(email);
    }

    // Validate username ///
    public void checkUsername(String username) {
        
        final boolean existByUsername = userRepository.existsByUsername(username);

        if (existByUsername) {
            log.warn("{} is already used!", username);

            final String exceptionMessage = messageAccessor.getMessage(USERNAME_EXCEPTION_MESSAGE);
            System.out.println(exceptionMessage);
            throw new RegistrationException(exceptionMessage);   
        }
    }

    // Validate email ///
    public void checkEmail(String email) {
        
        final boolean existByEmail = userRepository.existsByEmail(email);

        if (existByEmail) {
            log.warn("{} is already used!", email);

            final String exceptionMessage = messageAccessor.getMessage(EMAIL_EXCEPTION_MESSAGE);
            throw new RegistrationException(exceptionMessage); 
        }
    } 
    
    // Find Authenticated User by Username ///
    public AuthenticatedUserDto findAuthenticatedUserByUsername(String username) {

        final User user = userRepository.findByUsername(username);

        return UserMapper.INSTANCE.convertToAuthenticatedUserDto(user);
    }
}
