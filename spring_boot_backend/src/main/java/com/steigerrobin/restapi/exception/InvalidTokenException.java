package com.steigerrobin.restapi.exception;

// Custom Exception for Invalid JWT Token ///
public class InvalidTokenException extends RuntimeException {
    private final Object[] args;

    public InvalidTokenException(String message, Object... args) {
        super(message);
        this.args = args;
    }

    public Object[] getArgs() {
        return args;
    }
}
