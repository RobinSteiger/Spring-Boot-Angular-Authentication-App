package com.steigerrobin.restapi.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.steigerrobin.restapi.utils.MessageAccessor;

import lombok.AllArgsConstructor;

// Handler for Exception

@RestControllerAdvice
@AllArgsConstructor
public class GlobalExceptionHandler {

    private final MessageAccessor messageAccessor;

    // Invalid Token, contain internal exception code
    @ExceptionHandler(InvalidTokenException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, Object> handleInvalidTokenExceptions(InvalidTokenException exception) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", exception.getMessage());
        response.put("internalCode", exception.getInternalCode());
        return response;
    }

    // Registration 
    @ExceptionHandler(RegistrationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleRegistrationExceptions(RegistrationException exception) {
        System.out.println("RegistrationException : " + exception.getMessage());
        return exception.getMessage();
    }

    // Login
    @ExceptionHandler(LoginException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, Object> handleLoginTokenExceptions(LoginException exception) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", exception.getMessage());
        response.put("internalCode", exception.getInternalCode());
        return response;
    }

    // Resources not found
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleResourceNotFoundExceptions(ResourceNotFoundException exception) {
        return messageAccessor.getMessage("error.resource_not_found", exception.getArgs());
    }

    // Request validation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return errors;
    }

    // General
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String handleGeneralException(Exception exception) {
        exception.printStackTrace();
        return messageAccessor.getMessage("error.general");
    }
    
}
