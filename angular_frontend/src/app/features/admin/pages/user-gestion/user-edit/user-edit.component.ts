import { Component, DestroyRef, inject, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AlertStore } from '../../../../../core/services/ui/alert.store';
import { messages } from '../../../../../../resources/messages';
import { UserEditFormGroup, UserEditFormValue } from './user-edit-form.type';
import { MatIconModule } from '@angular/material/icon';
import { formatRoletoString, UserRole } from '../../../../../core/types/user-role.type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
    selector: 'app-user-edit',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule
],
    templateUrl: 'user-edit.component.html',
    styleUrl: 'user-edit.component.scss',
})
export class UserEditComponent {
  private readonly alertStore = inject(AlertStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly adminService = inject(AdminService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialogRef<UserEditComponent>);
  private readonly parameter = inject(MAT_DIALOG_DATA) as {userId : number};

  readonly messages = messages;
  // urls ?
  readonly userEditForm = this.createUserEditForm();
  readonly formControls = {
    firstname: this.userEditForm.get('firstname') as FormControl<string>,
    lastname: this.userEditForm.get('lastname') as FormControl<string>,
    email: this.userEditForm.get('email') as FormControl<string>,
    username: this.userEditForm.get('username') as FormControl<string>,
    userRole: this.userEditForm.get('userRole') as FormControl<UserRole[]>
  };

  availableRole : UserRole[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadUserDetails(this.parameter.userId);
  }

  private createUserEditForm() : UserEditFormGroup {
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
      userRole: new FormControl<UserRole[]>([], { 
        nonNullable: true 
      })
    });
  }

  private loadUserDetails(userId : number) {
    // Get all userRoles
    this.adminService.getAllRoles().subscribe({
      next: roles => {
        this.availableRole = roles;
        // Then get all data
        this.adminService.getUserDetails(userId).subscribe({
          next: data => {
            this.userEditForm.patchValue(data);
          },
          error: () => {
            this.alertStore.createErrorAlert("Failed to load user details!");
          }
        });
      },
      error: () => {
        this.alertStore.createErrorAlert("Failed to load roles!");
      }
    });
  }

  editUser(): void {
    if (this.userEditForm.invalid) {
      this.userEditForm.markAllAsTouched();
      return;
    }

    this.adminService
      .editUser(this.parameter.userId, {
        ...this.userEditForm.getRawValue()
      } as UserEditFormValue)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error : HttpErrorResponse) => {
          console.log(error.error);
          this.alertStore.createErrorAlert(error.error);
          this.dialogRef.close('error');
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.alertStore.createSuccessAlert("User successfully edited.");
        this.dialogRef.close('updated');
      });
  }

  formatRoletoString(role: UserRole): string {
    return formatRoletoString(role);
  }

  formatRoleListToString(roles : UserRole[]) : string {
    console.log("Form role list", roles);
    return roles.map(role => formatRoletoString(role)).join(", ");
  }

  compareRoles(role1: UserRole, role2: UserRole): boolean {
    return role1 && role2 && role1.id === role2.id;
  } 
}
