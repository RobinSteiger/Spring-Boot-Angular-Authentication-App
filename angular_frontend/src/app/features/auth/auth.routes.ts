import { AUTHENTICATION_PATHS } from "../../core/constants/paths.constants";
import { noAuthenticationGuard } from "../../core/guards/no-auth.guard";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";

export const AUTH_ROUTES = [
    {
        path: AUTHENTICATION_PATHS.logIn,
        component: LoginComponent,
        canActivate: [noAuthenticationGuard]
    },
    {
        path: AUTHENTICATION_PATHS.register,
        component: RegisterComponent,
        canActivate: [noAuthenticationGuard]
    },
    // MY ACCOUNT ?? //
]