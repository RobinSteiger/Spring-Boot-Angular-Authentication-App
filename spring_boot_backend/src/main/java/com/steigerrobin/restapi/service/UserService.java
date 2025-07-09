package com.steigerrobin.restapi.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.steigerrobin.restapi.dto.AllUsersDto;
import com.steigerrobin.restapi.dto.UserDetailsDto;
import com.steigerrobin.restapi.exception.ResourceNotFoundException;
import com.steigerrobin.restapi.mapper.UserMapper;
import com.steigerrobin.restapi.model.User;
import com.steigerrobin.restapi.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;

    public List<AllUsersDto> getAllUsers() {
        return userRepository.findAll().stream()
            .map(user -> UserMapper.INSTANCE.convertToAllUsersDto(user))
            .collect(Collectors.toList());
    }

    public UserDetailsDto getUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException(id)
        );
        return UserMapper.INSTANCE.convertToUserDetailsDto(user);
    }

    @Transactional
    public UserDetailsDto modifyUser(Long id, UserDetailsDto modifiedUser) {
        User newUser = UserMapper.INSTANCE.convertToUser(modifiedUser);
        return userRepository.findById(id)
            .map(user -> {
                user.setFirstname(newUser.getFirstname());
                user.setLastname(newUser.getLastname());
                user.setUsername(newUser.getUsername());
                user.setEmail(newUser.getEmail());
                user.setUserRole(newUser.getUserRole());
                userRepository.save(user);
                return UserMapper.INSTANCE.convertToUserDetailsDto(user);
            })
            .orElseThrow(
                () -> new ResourceNotFoundException(id)
            );
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    /*public User addUser(Ligue ligue) {
        return ligueRepository.save(ligue);
    }

    public Ligue modifyLigue(Integer id, Ligue newLigue) {
        Ligue existingLigue = getOneLigue(id);
        existingLigue.setName(newLigue.getName());
        return ligueRepository.save(existingLigue);
    }

    public void deleteLigue(Integer id) {
        // Generate the error if the ligue doesn't exist
        getOneLigue(id);
        ligueRepository.deleteById(id);
    } */
}
