package com.steigerrobin.restapi.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.steigerrobin.restapi.model.EnumUserRole;
import com.steigerrobin.restapi.model.User;
import com.steigerrobin.restapi.model.UserRole;
import com.steigerrobin.restapi.repository.UserRepository;
import com.steigerrobin.restapi.repository.UserRoleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;

    private final UserRoleRepository userRoleRepository;

    private final PasswordEncoder passwordEncoder;
    
    @Value("${ADMIN_USERNAME}")
    private String adminUsername;

    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;

    @Bean
    CommandLineRunner initRoles() {
        return args -> {
        for (EnumUserRole roleName : EnumUserRole.values()) {
            if (!userRoleRepository.existsByName(roleName)) {
                userRoleRepository.save(new UserRole(roleName));
                System.out.println("Role added in Database : " + roleName);
            }
        }
    };
    }

    @Bean
    CommandLineRunner initAdmin() {
        return args -> {
            if (!userRepository.existsByUsername(adminUsername)) {
                User admin = new User();
                admin.setFirstname("Admin");
                admin.setLastname("Admin");
                admin.setEmail("admin@root.com");
                admin.setUsername(adminUsername);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                UserRole roleUser = userRoleRepository.findByName(EnumUserRole.ROLE_ADMIN);
                admin.setUserRole(new HashSet<>(Set.of(roleUser)));

                userRepository.save(admin);
                log.info("Admin created : {} , {}", adminUsername, adminPassword);
            }
        };
    }
}
