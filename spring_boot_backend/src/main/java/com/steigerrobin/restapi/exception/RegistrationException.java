package com.steigerrobin.restapi.exception;

// Custom Exception for Registration Error ///
public class RegistrationException extends RuntimeException {
    private final Object[] args;

    public RegistrationException(String message, Object... args) {
        super(message);
        this.args = args;
    }

    public Object[] getArgs() {
        return args;
    }
}
