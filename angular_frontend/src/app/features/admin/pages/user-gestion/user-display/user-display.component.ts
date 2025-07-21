import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UserEditComponent } from '../user-edit/user-edit.component';
import type { UserDisplayResponse, UserDisplayResponseData } from '../../../types/user-display-response.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatRoletoString, type UserRole } from '../../../../../core/types/user-role.type';
    // https://material.angular.dev/components/table/overview

  @Component({
    selector: 'app-user-gestion',
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule
    ],
    templateUrl: 'user-display.component.html',
    styleUrl: 'user-display.component.scss',
})
  export class UserDisplayComponent {
    private readonly router = inject(Router);
    private readonly adminService = inject(AdminService);
    private readonly snackBar = inject(MatSnackBar);
    private readonly dialog = inject(MatDialog);

    users: UserDisplayResponseData[] = [];
    error: string = '';

    dataSource = new MatTableDataSource<UserDisplayResponseData>();
    displayedColumns: string[] = ['Id', 'Username', 'Roles', 'Actions'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor() {}

    ngOnInit() {
      this.loadUsers();
    }

    private loadUsers() {
      this.adminService.getUsers().subscribe({
        next: (data) => {
          this.users = data;
          this.dataSource.data = this.users;
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.showError('Failed to load users. Please try again later.');
        }
      });
    }

    formatRoletoString(role: UserRole): string {
      return formatRoletoString(role);
    }

    showError(message: string) {
      this.snackBar.open(message, '×', {
        duration: 4000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }

    public editUser(id: number) {
      const dialogRef = this.dialog.open(UserEditComponent, {
        height: '85%',
        width: '50%',
        data: {userId : id}
      });

      dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
          this.loadUsers();
        }
      });
    }

    public deleteUser(id: number) {

    }
  }
