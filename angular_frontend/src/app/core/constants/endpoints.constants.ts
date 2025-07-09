import { inject } from "@angular/core"
import type { Environment } from "../tokens/environment.token";
import { ENVIRONMENT } from "../tokens/environment.token"

/**
 * EndPoints from the API to use in the services
*/

export const getEndpoints = () => {
    const environment = inject<Environment>(ENVIRONMENT);
    return {
        auth: {
            v1: {
                login: `${environment.apiBaseUrl}/v1/authentication/login`,
                register: `${environment.apiBaseUrl}/v1/authentication/register`,
                refresh: `${environment.apiBaseUrl}/v1/authentication/refresh`,
                logout: `${environment.apiBaseUrl}/v1/authentication/logout`,
            },
        },
        admin: {
            v1: {
                user: `${environment.apiBaseUrl}/v1/users`,
                role: `${environment.apiBaseUrl}/v1/roles`
            },
        },
    } as const;
};