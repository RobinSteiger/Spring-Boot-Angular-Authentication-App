package com.steigerrobin.restapi.security.jwt;

// Security filter to intercept HTTP request, validate JWT token and throw security exception if needed. ///

import java.io.IOException;
import java.util.Objects;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import com.steigerrobin.restapi.security.utils.SecurityConstants;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenManager jwtTokenManager;

    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
        HttpServletRequest req, 
        HttpServletResponse res, 
        FilterChain chain
    ) throws ServletException, IOException {


        // Bypass filter verification if login || register ///
        final String requestURI = req.getRequestURI();
        if (requestURI.contains(SecurityConstants.LOGIN_REQUEST_URI) ||
            requestURI.contains(SecurityConstants.REGISTRATION_REQUEST_URI)) {
                chain.doFilter(req, res);
                return;
        }

        // Recover token and username ///
        final String header = req.getHeader(SecurityConstants.HEADER_STRING);
        String username = null;
        String token = null;
        if (Objects.nonNull(header) && header.startsWith(SecurityConstants.TOKEN_PREFIX)) {
            token = header.replace(SecurityConstants.TOKEN_PREFIX, "");
            username = jwtTokenManager.getUsernameFromToken(token);
        }

        // Create Authentication ///
        final SecurityContext securityContext = SecurityContextHolder.getContext();
        if (Objects.nonNull(username) && Objects.isNull(securityContext.getAuthentication())) {
            final UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtTokenManager.validateToken(token, userDetails.getUsername())) {
                final UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                log.info("Authentication successful. Logged in username : {}", username);
                securityContext.setAuthentication(authentication);
            }
        }

        // Launch next filter ///
        chain.doFilter(req, res);
    }
}
