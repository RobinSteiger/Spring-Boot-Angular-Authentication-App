import { ADMIN_PATHS, AUTHENTICATION_PATHS, ROOT_PATHS } from "./paths.constants";

/**
 * Final forms of the URI. 
 */

export const ROOT_URLS = {
    home: `/${ROOT_PATHS.home}`,
    error404: `/${ROOT_PATHS.error404}`,
};

export const AUTH_URLS = {
    login: `/${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.logIn}`,
    register: `/${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.register}`,
    //myAccount: `/${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.myAccount}`,
};

export const ADMIN_URLS = {
    user_gestion: `/${ADMIN_PATHS.base}/${ADMIN_PATHS.user_gestion}`,
    //register: `/${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.register}`,
    //myAccount: `/${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.myAccount}`,
};