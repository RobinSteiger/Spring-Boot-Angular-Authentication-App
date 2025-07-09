import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { ROOT_PATHS } from '../constants/paths.constants';

export function noAuthenticationGuard(): boolean {
  const authenticationService = inject(AuthService);
  const router = inject(Router);

  console.log("From no auth gards");

  if (authenticationService.authState().isLoggedIn) {
    void router.navigate([ROOT_PATHS.home]);
    return false;
  }

  return true;
}