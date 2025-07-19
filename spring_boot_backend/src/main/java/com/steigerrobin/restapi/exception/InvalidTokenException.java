package com.steigerrobin.restapi.exception;

// Custom Exception for Invalid JWT Token / Refresh Token ///
public class InvalidTokenException extends RuntimeException {

    private final Object[] args;

    private final int internalCode;

    public InvalidTokenException(String message, int internalCode, Object... args) {
        super(message);
        this.args = args;
        this.internalCode = internalCode;
    }

    public Object[] getArgs() {
        return args;
    }

    public int getInternalCode() {
        return internalCode;
    }
}
