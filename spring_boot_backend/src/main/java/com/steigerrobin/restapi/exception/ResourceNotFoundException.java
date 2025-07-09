package com.steigerrobin.restapi.exception;

// Custom Exception for Resource not found. ///
public class ResourceNotFoundException extends RuntimeException {
    private final Object[] args;

    public ResourceNotFoundException(Object... args) {
        super();
        this.args = args;
    }

    public Object[] getArgs() {
        return args;
    }
}
