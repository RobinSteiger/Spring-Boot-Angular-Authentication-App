import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { ACCESS_TOKEN_KEY, AuthService } from '../../features/auth/services/auth.service';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from '../providers/local-storage';
import { AUTH_URLS } from '../constants/urls.constants';
import { AppError } from '../enums/app-error.enum';
import { AlertStore } from '../services/ui/alert.store';
import { messages } from '../../../resources/messages';

const isRefreshing = new BehaviorSubject<boolean>(false);

export function authenticationInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) : Observable<HttpEvent<unknown>> {
  const authenticationService = inject(AuthService);
  const alertStore = inject(AlertStore);
  const storageService = inject(LOCAL_STORAGE);
  const router = inject(Router);
  const clonedRequest = attachAccessToken(request, storageService);
  return handleRequest({
    request: clonedRequest,
    next,
    authenticationService,
    alertStore,
    storageService,
    router,
  });

}

// Attach access token ///
function attachAccessToken(
  request: HttpRequest<unknown>,
  storageService: Storage | null,
): HttpRequest<unknown> {
  const accessToken = storageService?.getItem(ACCESS_TOKEN_KEY);
  if (accessToken) {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}`},
    });
  }
  return request;
}

// Launch Error Gestion ///
function handleRequest(parameters: {
  request: HttpRequest<unknown>;
  next: HttpHandlerFn;
  authenticationService: AuthService;
  alertStore: AlertStore;
  storageService: Storage | null;
  router: Router;
}): Observable<HttpEvent<unknown>> {
  return parameters.next(parameters.request).pipe(
    catchError((errorResponse: HttpErrorResponse) =>
      handleErrors({
        errorResponse,
        ...parameters,
      }),
    ),
  );
}

// Error gestion ///

function handleErrors(parameters: {
  request: HttpRequest<unknown>;
  next: HttpHandlerFn;
  authenticationService: AuthService;
  alertStore: AlertStore;
  storageService: Storage | null;
  router: Router;
  errorResponse: HttpErrorResponse;
}): Observable<HttpEvent<unknown>> {
  console.log(parameters.errorResponse);
  if (isAccessTokenError(parameters.errorResponse)) {
    console.log("Access token error");
    return tryRefreshToken(parameters);
  }

  if (isRefreshTokenError(parameters.errorResponse)) {
    console.log("Refresh token error");
    parameters.authenticationService.logout();
    void parameters.router.navigate([AUTH_URLS.login]);
    return throwError(() => new Error(messages.sessionExpired));
  }

  return throwError(() => parameters.errorResponse);
}

// Access Token Error ///
function isAccessTokenError(errorResponse: HttpErrorResponse): boolean {
  return (
    errorResponse.status === 401 &&
    [AppError.ACCESS_TOKEN_NOT_FOUND, AppError.ACCESS_TOKEN_EXPIRED].includes(
      errorResponse.error.internalCode,
    )
  );
}

// Refresh Token Error ///
function isRefreshTokenError(errorResponse: HttpErrorResponse): boolean {
  return (
    errorResponse.status === 401 &&
    [AppError.REFRESH_TOKEN_NOT_FOUND, AppError.REFRESH_TOKEN_EXPIRED].includes(
      errorResponse.error.internalCode,
    )
  );
}

function tryRefreshToken(parameters: {
  request: HttpRequest<unknown>;
  next: HttpHandlerFn;
  authenticationService: AuthService;
  alertStore: AlertStore;
  storageService: Storage | null;
  router: Router;
}): Observable<HttpEvent<unknown>> {
  console.log("Trying to refresh access token");
  if (!isRefreshing.getValue()) {
    return handleTokenRefresh(parameters);
  }

  return waitForTokenRefresh(parameters);
}

function handleTokenRefresh(parameters: {
  request: HttpRequest<unknown>;
  next: HttpHandlerFn;
  authenticationService: AuthService;
  alertStore: AlertStore;
  storageService: Storage | null;
  router: Router;
}): Observable<HttpEvent<unknown>> {
  isRefreshing.next(true);

  return parameters.authenticationService.refreshToken().pipe(
    switchMap(() => {
      isRefreshing.next(false);
      return retryRequestWithRefreshedToken(parameters);
    }),
    catchError((error: HttpErrorResponse) => {
      isRefreshing.next(false);
      handleRefreshError(parameters);
      return throwError(() => error);
    }),
  );
}

function waitForTokenRefresh(parameters: {
  request: HttpRequest<unknown>;
  next: HttpHandlerFn;
  storageService: Storage | null;
}): Observable<HttpEvent<unknown>> {
  return isRefreshing.pipe(
    filter((refreshing) => !refreshing),
    take(1),
    switchMap(() => retryRequestWithRefreshedToken(parameters)),
  );
}

function retryRequestWithRefreshedToken(parameters: {
  request: HttpRequest<unknown>;
  next: HttpHandlerFn;
  storageService: Storage | null;
}): Observable<HttpEvent<unknown>> {
  const refreshedToken = parameters.storageService?.getItem(ACCESS_TOKEN_KEY);
  const clonedRequest = refreshedToken
    ? parameters.request.clone({
        setHeaders: { Authorization: `Bearer ${refreshedToken}` },
      })
    : parameters.request;
  return parameters.next(clonedRequest);
}

function handleRefreshError(parameters: {
  authenticationService: AuthService;
  alertStore: AlertStore;
  router: Router;
}): void {
  parameters.authenticationService.logout();
  parameters.alertStore.createErrorAlert(messages.sessionExpired);
  void parameters.router.navigate([AUTH_URLS.login]);
}

//https://github.com/Ismaestro/angular-example-app/blob/master/src/app/core/interceptors/authentication.interceptor.ts

