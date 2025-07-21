import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import type { LogInFormState, LogInFormGroup } from './login-form.type';
import { AUTH_URLS, ROOT_URLS } from '../../../../core/constants/urls.constants';
import { messages } from '../../../../../resources/messages';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { passwordValidator } from '../../validator/password.validator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AlertStore } from '../../../../core/services/ui/alert.store';
import { AppError } from '../../../../core/enums/app-error.enum';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        RouterLink
    ],
    templateUrl: 'login.component.html',
    styleUrl: 'login.component.scss',
})
export class LoginComponent {
  private readonly alertStore = inject(AlertStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly messages = messages;
  readonly authUrls = AUTH_URLS;
  readonly loginForm = this.createLoginForm();
  readonly formControls = {
    username: this.loginForm.get('username') as FormControl<string>,
    password: this.loginForm.get('password') as FormControl<string>
  };
  readonly formState = signal<LogInFormState>({
    isLoading: false,
    isSubmitted: false
  });

  readonly hidePassword = signal(true);

  private createLoginForm(): LogInFormGroup {
    return this.formBuilder.group({
      username: new FormControl<string>('', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true,
      }),
      password: new FormControl<string>('', {
        validators: [Validators.required, passwordValidator()],
        nonNullable: true,
      }),
    });
  }

  sendForm(): void {
    this.updateFormState({isSubmitted: true});

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.updateFormState({isLoading: true});
    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.updateFormState({isLoading: false});
        }),
        catchError((error : HttpErrorResponse) => {
          console.log(error.error);
          this.handleLoginError(error);
          return EMPTY;
        })
      )
      .subscribe({
        next: () => this.router.navigate([ROOT_URLS.home])
      });
  }

   private handleLoginError(error : HttpErrorResponse): void {
    const errorMessage = 
      error.error.internalCode == AppError.INVALID_CREDENTIALS
      ? messages.loginCredentialsError
      : messages.genericErrorAlert;
      console.log(errorMessage);
    this.alertStore.createErrorAlert(errorMessage);
    //console.error('Registration error');
    //this.showError('Login failed.\n Cause: '+ err + '\nPlease try again.');
    //this.updateFormState({ isLoading: false });
  }

  showError(message: string) {
    this.snackBar.open(message, '×', {
      duration: 4000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    //event.stopPropagation();
  }

  private updateFormState(updates: Partial<LogInFormState>): void {
    this.formState.update((state) => ({ ...state, ...updates }));
  }
}
