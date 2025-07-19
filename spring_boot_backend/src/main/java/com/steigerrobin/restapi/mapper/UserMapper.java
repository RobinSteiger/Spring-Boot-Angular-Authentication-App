package com.steigerrobin.restapi.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

import com.steigerrobin.restapi.dto.UserDetailsDto;
import com.steigerrobin.restapi.dto.UsersDto;
import com.steigerrobin.restapi.model.User;
import com.steigerrobin.restapi.security.dto.AuthenticatedUserDto;
import com.steigerrobin.restapi.security.dto.RegistrationRequest;


// Mapper to automatise conversion between entity and dto ///

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

	UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

	User convertToUser(RegistrationRequest registrationRequest);

	AuthenticatedUserDto convertToAuthenticatedUserDto(User user);

	UsersDto convertToAllUsersDto(User user);

	UserDetailsDto convertToUserDetailsDto(User user);

	User convertToUser(UserDetailsDto userDetailsDto);

}

