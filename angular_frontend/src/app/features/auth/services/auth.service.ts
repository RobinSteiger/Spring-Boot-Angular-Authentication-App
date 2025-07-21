import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, linkedSignal } from '@angular/core';
import { catchError, EMPTY, map, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { JwtToken } from '../../../core/types/jwt-token.type';
import { getEndpoints } from '../../../core/constants/endpoints.constants';
import { LOCAL_STORAGE } from '../../../core/providers/local-storage';
import type { RegisterFormValue } from '../pages/register/register-form.type';
import type { RegisterResponse, RegisterResponseData } from '../types/register-response.type';
import { LoginRequest } from '../types/login-request.type';
import { LoginResponse, LoginResponseData } from '../types/login-response.type';
import { RefreshTokenResponse, RefreshTokenResponseData } from '../types/refresh-token-response.type';

// Key for storage ///
export const ACCESS_TOKEN_KEY = 'access-token';
export const REFRESH_TOKEN_KEY = 'refresh-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly endpoints = getEndpoints();
  private readonly storageService = inject(LOCAL_STORAGE);
  private readonly httpClient = inject(HttpClient);

  private readonly authTokens = signal<{ accessToken?: string; refreshToken?: string }>({
    accessToken: this.storageService?.getItem(ACCESS_TOKEN_KEY) ?? undefined,
    refreshToken: this.storageService?.getItem(REFRESH_TOKEN_KEY) ?? undefined
  });

  // Shared and can be modified from elsewhere //
  readonly authState = linkedSignal({
    source: this.authTokens,
    computation: (tokens) => ({
      isLoggedIn: !!tokens.accessToken,
      hasRefreshToken: !!tokens.refreshToken,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userRole: this.getUserRole(tokens.accessToken!)
    })
  });

  // https://github.com/Ismaestro/angular-example-app/blob/master/src/app/features/authentication/services/authentication.service.ts

  register(registerRequest: RegisterFormValue): Observable<RegisterResponseData> {
    return this.httpClient
      .post<RegisterResponse>(
        this.endpoints.auth.v1.register,
        {
          firstname: registerRequest.firstname,
          lastname: registerRequest.lastname,
          email: registerRequest.email.toLowerCase(),
          username: registerRequest.username,
          password: registerRequest.password
        })
        .pipe(
          map((response: RegisterResponse) => {
            const { data } = response;
            console.log(response);
            this.saveTokens(data);
            return data;
          })
        );
  }

  login(loginRequest: LoginRequest): Observable<LoginResponseData> {
    console.log("Into Login from service");
    return this.httpClient
    .post<LoginResponse>(this.endpoints.auth.v1.login, {
      username: loginRequest.username,
      password: loginRequest.password
    })
      .pipe(
        map((response: LoginResponse) => {
          console.log(response);
          const { data } = response;
          this.saveTokens(data);
          return data;
        })
      );
  }

  refreshToken(): Observable<RefreshTokenResponseData> {
    console.log("Refresh Token request");
    return this.httpClient
      .post<RefreshTokenResponse>(this.endpoints.auth.v1.refresh, {
        refreshToken: this.storageService?.getItem(REFRESH_TOKEN_KEY),
      })
      .pipe(
        map((response: RefreshTokenResponse) => {
          const { data } = response;
          this.saveTokens(data);
          return data;
        }),
      );
  }


  logout(): void {
    //clearCache(); cache gestion with caching.interceptors
    this.removeTokens();
  }

  private saveTokens(data: { accessToken: string; refreshToken?: string }) {
    this.storageService?.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    if (data.refreshToken) {
      this.storageService?.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }
    this.authTokens.set({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    });
    console.log("New token saved");
    const exp = jwtDecode(data.accessToken).exp;
    if (exp !== undefined) {
      console.log("Expiration time:", new Date(exp * 1000).toLocaleString());
    } else {
      console.log("Expiration time: not available");
    }
  }

  private removeTokens(): void {
    this.storageService?.removeItem(ACCESS_TOKEN_KEY);
    this.storageService?.removeItem(REFRESH_TOKEN_KEY);
    this.authTokens.set({});
  }

  public getUserRole(accessToken: string): string[] {
    try {
      return jwtDecode<JwtToken>(accessToken).role.map(
        role => role.startsWith('ROLE_') ? role.substring(5).toLowerCase() : role
      );
    } catch (error) {
      return [];
    }
  }
}
