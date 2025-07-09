package com.steigerrobin.restapi.security.utils;

public class SecurityConstants {

    public static final String VERSION_URI = "/v1";

    // URI for Authentication ///

    public static final String AUTHENTICATION_URI = VERSION_URI + "/authentication";
    
    public static final String LOGIN_REQUEST_URI = "/login";

	public static final String REGISTRATION_REQUEST_URI = "/register";

    public static final String REFRESH_TOKEN_REQUEST_URI = "/refresh";

    public static final String LOGOUT_REQUEST_URI = "/logout";

    // URI for Users ///

    public static final String USER_URI = VERSION_URI + "/users";

    // URI for UserRole //

    public static final String USER_ROLE_URI = VERSION_URI + "/roles";


    // Authorization Prefix in HttpServlet ///

    public static final String HEADER_STRING = "Authorization";

    public static final String TOKEN_PREFIX = "Bearer ";
    
}
