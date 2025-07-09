package com.steigerrobin.restapi.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.steigerrobin.restapi.model.RefreshToken;
import com.steigerrobin.restapi.model.User;



@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    RefreshToken findByToken(String token);

    boolean existsByUser(User user);

    @Modifying
    int deleteByUser(User user);
}
