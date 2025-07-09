package com.steigerrobin.restapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.steigerrobin.restapi.model.User;



@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    User findByUsername(String username);
}
