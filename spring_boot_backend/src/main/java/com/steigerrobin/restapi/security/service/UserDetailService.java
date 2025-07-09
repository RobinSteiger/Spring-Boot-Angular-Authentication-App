package com.steigerrobin.restapi.security.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.steigerrobin.restapi.exception.ResourceNotFoundException;
import com.steigerrobin.restapi.mapper.UserMapper;
import com.steigerrobin.restapi.repository.UserRepository;
import com.steigerrobin.restapi.security.dto.AuthenticatedUserDto;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// Adapter between our User model and the UserDetails via User from Spring Security (AuthenticationManager) ///

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailService implements UserDetailsService {
    
    private final UserRepository userRepository;

    @Override
    @Transactional // Needed for the UserRole to be charged correctly ///
    public UserDetails loadUserByUsername(String username) {
        
        final AuthenticatedUserDto user = 
            UserMapper.INSTANCE.convertToAuthenticatedUserDto(userRepository.findByUsername(username));

        if (Objects.isNull(user)) {
            throw new ResourceNotFoundException(username);
        }
        
        List<SimpleGrantedAuthority> authorities = user.getUserRole()
            .stream()
            .map(role -> new SimpleGrantedAuthority(role.getName().name()))
            .collect(Collectors.toList());

        return new User(user.getUsername(), user.getPassword(), authorities);
    }  
}
