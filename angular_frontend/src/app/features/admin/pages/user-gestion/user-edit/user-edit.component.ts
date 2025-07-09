import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-user-edit',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatSnackBarModule
    ],
    template: `
    <form *ngIf="form" [formGroup]="form" (ngSubmit)="onSubmit()" class="edit-form">
      <h2>Edit User</h2>

      <mat-form-field appearance="outline">
        <mat-label>Firstname</mat-label>
        <input matInput formControlName="firstname" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Lastname</mat-label>
        <input matInput formControlName="lastname" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Username</mat-label>
        <input matInput formControlName="username" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Roles</mat-label>
        <mat-select formControlName="roles" multiple>
          <mat-option *ngFor="let role of availableRole" [value]="role">{{ role }}</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="button-row">
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
      </div>
    </form>
  `,
    styles: [`
    .edit-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    .button-row {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    mat-form-field {
      width: 100%;
    }

    .input {
      color: var(--color-text-primary);
    }

    h2 {
      color: black;
      margin-bottom: 1rem;
    }
  `]
})
export class UserEditComponent {
  form! : FormGroup;
  availableRole : String[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    public dialogRef: MatDialogRef<UserEditComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {}

  ngOnInit(): void {
    this.adminService.getUserDetails(this.data.userId).subscribe({
      next: user => {
        console.log(user);
        this.form = this.fb.group({
          firstname: [user.firstname, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z]+$/)
          ]],
          lastname: [user.lastname, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z]+$/)
          ]],
          email: [user.email, [
            Validators.required,
            Validators.email,
            Validators.minLength(7),
            Validators.maxLength(40)
          ]],
          username: [user.username, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(40),
            Validators.pattern(/^[a-zA-Z0-9._-]{3,40}$/)
          ]],
          roles: [user.userRole] 
        });
      },
      error: () => {
        this.snackBar.open("Failed to load user details", "Close", { duration: 3000 });
        this.dialogRef.close();
      }
    });
    this.adminService.getAllRoles().subscribe({
      next: roles => {
        this.availableRole = roles;
      },
      error: () => {
        this.snackBar.open("Failed to load roles", "Close", { duration: 3000 });
      }
    });
  }

  onSubmit() {
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
   
}
