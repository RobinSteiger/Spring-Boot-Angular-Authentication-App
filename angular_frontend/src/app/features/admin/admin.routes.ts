import { ADMIN_PATHS } from "../../core/constants/paths.constants";
import { UserDisplayComponent } from "./pages/user-gestion/user-display/user-display.component";


export const ADMIN_ROUTES = [
    {
        path: ADMIN_PATHS.user_gestion,
        component: UserDisplayComponent,
    },
    /*{
        path: AUTHENTICATION_PATHS.register,
        component: RegisterComponent,
        canActivate: [noAuthenticationGuard]
    },*/
]