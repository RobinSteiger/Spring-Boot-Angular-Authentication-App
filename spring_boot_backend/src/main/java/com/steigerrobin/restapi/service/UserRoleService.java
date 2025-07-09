package com.steigerrobin.restapi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.steigerrobin.restapi.model.UserRole;
import com.steigerrobin.restapi.repository.UserRoleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserRoleService {
    private final UserRoleRepository userRoleRepository;

    public List<UserRole> getAllUserRole() {
        return userRoleRepository.findAll();
    }
}
