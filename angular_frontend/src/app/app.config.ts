import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { authenticationInterceptor } from './core/interceptors/auth.interceptor';
import { ENVIRONMENT } from './core/tokens/environment.token';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // Global injection
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(
      appRoutes,
      // Save scroll position while navigation ///
      withInMemoryScrolling(),
      // View transitions between routes ///
      withViewTransitions(),
      // Link directly @Input in a component with the :param in the route ///
      withComponentInputBinding(),
    ),
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    importProvidersFrom(BrowserAnimationsModule),
  ]
};
