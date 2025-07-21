import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ADMIN_PATHS, AUTHENTICATION_PATHS, ROOT_PATHS } from './core/constants/paths.constants';
import { HomeComponent } from './features/home/home.component';

/* Routes */

export const appRoutes: Routes = [
  {
    path: ROOT_PATHS.home,
    component: HomeComponent,
  },
  {
    path: AUTHENTICATION_PATHS.base,
    loadChildren: async () => 
      import('./features/auth/auth.routes').then(
        (module_) => module_.AUTH_ROUTES,
      ),
  },
  {
    path: ADMIN_PATHS.base,
    loadChildren: async () => 
      import('./features/admin/admin.routes').then(
        (module_) => module_.ADMIN_ROUTES,
      ),
  },
];
