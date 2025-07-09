package com.steigerrobin.restapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.steigerrobin.restapi.security.jwt.JwtAuthenticationEntryPoint;
import com.steigerrobin.restapi.security.jwt.JwtAuthenticationFilter;
import com.steigerrobin.restapi.security.utils.SecurityConstants;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
// Authentication before access to functionality
@EnableMethodSecurity(prePostEnabled=true)
public class SecurityConfiguration {

    // Jwt token verification filter ///
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Authentication exception handler ///
    private final JwtAuthenticationEntryPoint unauthorizedHandler;

    // Mandatory for the AuthenticationManager to be injected correctly ///
    @Bean
	public AuthenticationManager authenticationManager(final AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

    @Bean
    SecurityFilterChain configure(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        return http

            // Source coming from WebCorsConfiguration
            .cors(cors -> cors.configurationSource(corsConfigurationSource))

            // CSRF based on auth cookie from navigator, so not needed for Jwt header verification ///
            .csrf(csrf -> csrf.disable())

            // Custom Filters applied before authorization rules///
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

            // Authorization rules ///
            .authorizeHttpRequests(auth -> auth

                // Allow pre-flight requests for tokens ///
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Authentication
                .requestMatchers(
                    SecurityConstants.AUTHENTICATION_URI + "/**",
                    "/health",
                    "/actuator/**"
                ).permitAll()
                // User
                .requestMatchers(
                    SecurityConstants.USER_URI + "/**", 
                    SecurityConstants.USER_URI
                ).hasAnyRole("ADMIN", "MODERATOR")
                // User Role
                .requestMatchers(
                    SecurityConstants.USER_ROLE_URI + "/**", 
                    SecurityConstants.USER_ROLE_URI
                ).hasAnyRole("ADMIN", "MODERATOR")                
                .anyRequest().authenticated()
            )

        // Exception handling (custom handler for unauthorized requests) ///
        .exceptionHandling(exceptionHandling -> 
            exceptionHandling.authenticationEntryPoint(unauthorizedHandler)
        )

        // Stateless session management
        .sessionManagement(session -> 
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )

        .build();
    }
}
