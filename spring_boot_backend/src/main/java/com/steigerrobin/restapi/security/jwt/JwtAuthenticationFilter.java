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
import org.springframework.web.servlet.HandlerExceptionResolver;

import com.steigerrobin.restapi.exception.InvalidTokenException;
import com.steigerrobin.restapi.security.utils.SecurityConstants;
import com.steigerrobin.restapi.utils.MessageAccessor;

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

    private final MessageAccessor messageAccessor;

    private final HandlerExceptionResolver handlerExceptionResolver;

    private final String ACCESS_TOKEN_NOT_FOUND_MESSAGE = "access_token_not_found";
    private final String ACCESS_TOKEN_EXPIRED_MESSAGE = "access_token_expired";


    @Override
    protected void doFilterInternal(
        HttpServletRequest req, 
        HttpServletResponse res, 
        FilterChain chain
    ) throws ServletException, IOException {
        
        try {

            // Bypass filter verification if login || register || refresh ///
            final String requestURI = req.getRequestURI();
            if (requestURI.contains(SecurityConstants.LOGIN_REQUEST_URI) ||
                requestURI.contains(SecurityConstants.REGISTRATION_REQUEST_URI) ||
                requestURI.contains(SecurityConstants.REFRESH_TOKEN_REQUEST_URI)) {
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
                } else {
                    // Token not validated ///
                    if (jwtTokenManager.isTokenExpired(token)) {
                        String message = messageAccessor.getMessage(ACCESS_TOKEN_EXPIRED_MESSAGE);
                        // TODO : Fix logging not displayed
                        log.warn(message);
                        throw new InvalidTokenException(message, 3002);
                    } else {
                        String message = messageAccessor.getMessage(ACCESS_TOKEN_NOT_FOUND_MESSAGE);
                        // TODO : Fix logging not displayed
                        log.warn(message);
                        throw new InvalidTokenException(message, 3000);
                    }
                }
            }

            // Launch next filter ///
            chain.doFilter(req, res);

        } catch (Exception e) {
            handlerExceptionResolver.resolveException(req, res, null, e);
        }
    }
}
