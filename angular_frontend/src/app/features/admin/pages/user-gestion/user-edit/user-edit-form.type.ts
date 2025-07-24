import type { FormControl, FormGroup } from '@angular/forms';
import { UserRole } from '../../../../../core/types/user-role.type';

export type UserEditFormGroup = FormGroup<{
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  email: FormControl<string>;
  username: FormControl<string>;
  userRole: FormControl<UserRole[]>
}>;

export type UserEditFormValue = {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  userRole: FormControl<UserRole[]>;
};