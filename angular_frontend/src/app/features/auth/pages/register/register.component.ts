import { Component, inject, signal, DestroyRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RegisterFormGroup, RegisterFormState, RegisterFormValue } from './register-form.type';
import { AUTH_URLS, ROOT_URLS } from '../../../../core/constants/urls.constants';
import { catchError, EMPTY, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { messages } from '../../../../../resources/messages';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { passwordValidator } from '../../validator/password.validator';

@Component({
    selector: 'app-register',
    //encapsulation: ViewEncapsulation.None,
    imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        RouterLink,
        MatInputModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: 'register.component.html',
    styleUrl: 'register.component.scss',
})
export class RegisterComponent {
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly messages = messages;
  readonly authUrls = AUTH_URLS;
  readonly registerForm = this.createRegisterForm();
  readonly formControls = {
    firstname: this.registerForm.get('firstname') as FormControl<string>,
    lastname: this.registerForm.get('lastname') as FormControl<string>,
    email: this.registerForm.get('email') as FormControl<string>,
    username: this.registerForm.get('username') as FormControl<string>,
    password: this.registerForm.get('password') as FormControl<string>,
    confirmPassword: this.registerForm.get('confirmPassword') as FormControl<string>,
  };
  readonly formState = signal<RegisterFormState>({
    isLoading: false,
    isSubmitted: false,
    isRegistrationCompleted: false,
    passwordsMatch: false
  });

  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);

  constructor() {}

  ngOnInit() {
     merge(this.formControls.password.valueChanges, this.formControls.confirmPassword.valueChanges)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.checkPasswords();
      });
  }

  private createRegisterForm(): RegisterFormGroup {
    return this.formBuilder.group({
      firstname: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z]+$/)
        ],
        nonNullable: true
      }),
      lastname: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z]+$/)
        ],
        nonNullable: true
      }),
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.email,
          Validators.minLength(7),
          Validators.maxLength(40)
        ],
        nonNullable: true
      }),
      username: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
          Validators.pattern(/^[a-zA-Z0-9._-]{3,40}$/)
        ],
        nonNullable: true
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
          passwordValidator()
        ],
        nonNullable: true
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, passwordValidator()],
        nonNullable: true
        })
      });
  }

  private checkPasswords(): void {
    if (this.formControls.password.value === this.formControls.confirmPassword.value) {
      this.updateFormState({ passwordsMatch: true });
      this.formControls.confirmPassword.setErrors(null);
    } else {
      this.updateFormState({
        passwordsMatch: false,
      });
      this.formControls.confirmPassword.setErrors({ notEqual: true });
    }
  }

  register(): void {
    this.updateFormState({ isSubmitted: true});

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.updateFormState({ isLoading: true });

    this.authService
      .register({
        ...this.registerForm.getRawValue()
      } as RegisterFormValue)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err : HttpErrorResponse) => {
          console.log(err.error);
          this.handleRegistrationError(err.error);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.handleRegistrationSuccess();
      });
  }

  showError(message: string) {
    this.snackBar.open(message, '×', {
      duration: 4000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  private handleRegistrationError(err : String): void {
    console.error('Registration error');
    this.showError('Registration failed.\n Cause: '+ err + '\nPlease try again.');
    this.updateFormState({ isLoading: false });
  }

  private handleRegistrationSuccess() : void {
    console.log('User registered successfully');
    this.snackBar.open('Registration successful! Please login.', '×', {
      duration: 4000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    void this.router.navigate([ROOT_URLS.home]);
  }

  private updateFormState(updates: Partial<RegisterFormState>): void {
    this.formState.update((state) => ({ ...state, ...updates }));
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  toggleConfirmPasswordVisibility(event: MouseEvent) {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
    event.stopPropagation();
  }
}
