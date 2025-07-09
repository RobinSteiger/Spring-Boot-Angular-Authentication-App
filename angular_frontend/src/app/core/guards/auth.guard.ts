import { inject } from "@angular/core";
import { AuthService } from "../../features/auth/services/auth.service";
import { Router } from "@angular/router";
import { AUTH_URLS } from "../constants/urls.constants";


export function authGuard(): boolean{
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log("From auth gards");

  if (authService.authState().isLoggedIn) {
    console.log("Is logged in");
    return true;
  }

  console.log("Is NOT logged in");

  void router.navigate([AUTH_URLS.login]);
  return false;
};