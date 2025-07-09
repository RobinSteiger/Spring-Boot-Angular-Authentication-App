import type { FormControl, FormGroup } from '@angular/forms';

export type RegisterFormGroup = FormGroup<{
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  email: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}>;

export type RegisterFormValue = {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
};

export type RegisterFormState = {
  isLoading: boolean;
  isSubmitted: boolean;
  isRegistrationCompleted: boolean;
  passwordsMatch: boolean;
};