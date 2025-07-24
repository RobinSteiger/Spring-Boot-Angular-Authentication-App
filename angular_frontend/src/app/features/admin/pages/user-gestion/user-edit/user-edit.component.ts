import { Component, DestroyRef, inject, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AlertStore } from '../../../../../core/services/ui/alert.store';
import { messages } from '../../../../../../resources/messages';
import { UserEditFormGroup } from './user-edit-form.type';
import { MatIconModule } from '@angular/material/icon';
import { formatRoletoString, UserRole } from '../../../../../core/types/user-role.type';

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
  private readonly destroyRed = inject(DestroyRef);
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

  debug(val : any) : void {
    console.log(val);
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

  editUser() {}

  /*onSubmit() {
    if (this.form.invalid) return;

    const updatedUser = {
      id: this.data.userId,
      ...this.form.value
    };
/*
    this.adminService.updateUser(updatedUser).subscribe({
      next: () => {
        this.snackBar.open("User updated successfully", "Close", { duration: 3000 });
        this.dialogRef.close('updated');
      },
      error: () => {
        this.snackBar.open("Failed to update user", "Close", { duration: 3000 });
      }
    });
     */
  
   
}
