package com.steigerrobin.restapi.utils;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;


// Centralize all messages for exception/errors/sucess/etc. (internationalization, re-usable)
@Component
@AllArgsConstructor
public class MessageAccessor {
    
    private final MessageSource messageSource;

    public String getMessage(String key, Object... args) {
        return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
    }
}
