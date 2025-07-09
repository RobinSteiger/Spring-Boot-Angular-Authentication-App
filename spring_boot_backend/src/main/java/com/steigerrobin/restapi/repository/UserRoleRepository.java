package com.steigerrobin.restapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.steigerrobin.restapi.model.EnumUserRole;
import com.steigerrobin.restapi.model.UserRole;



@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    UserRole findByName(EnumUserRole role);

    boolean existsByName(EnumUserRole role);
}
