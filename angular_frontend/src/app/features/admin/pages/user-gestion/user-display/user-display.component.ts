import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserEditComponent } from '../user-edit/user-edit.component';
import type { UserDisplayResponse, UserDisplayResponseData } from '../../../types/user-display-response.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatRoletoString, type UserRole } from '../../../../../core/types/user-role.type';
import { OverlayContainer, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { AlertStore } from '../../../../../core/services/ui/alert.store';
import { UserDeleteComponent } from '../user-delete/user-delete.component';
    // https://material.angular.dev/components/table/overview

  @Component({
    selector: 'app-user-gestion',
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
    ],
    templateUrl: 'user-display.component.html',
    styleUrl: 'user-display.component.scss',
})
  export class UserDisplayComponent {
    private readonly router = inject(Router);
    private readonly adminService = inject(AdminService);
    private readonly dialog = inject(MatDialog);
    private readonly scrollStrategy = inject(ScrollStrategyOptions);
    private readonly alertStore = inject(AlertStore);

    users: UserDisplayResponseData[] = [];
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
          this.alertStore.createErrorAlert('Failed to load users. Please try again later.');
        }
      });
    }

    formatRoletoString(role: UserRole): string {
      return formatRoletoString(role);
    }

    public editUser(id: number) {
      const dialogRef = this.dialog.open(UserEditComponent, {
        height: '85%',
        width: '50%',
        data: {userId : id},
        backdropClass: 'backdropBackground',
        scrollStrategy: this.scrollStrategy.noop(),
      });

      dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
          this.loadUsers();
        }
      });
    }

    public deleteUser(id: number) {
      const dialogRef = this.dialog.open(UserDeleteComponent, {
        data: {userId : id},
        backdropClass: 'backdropBackground',
        scrollStrategy: this.scrollStrategy.noop(),
      });

      dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted') {
          this.loadUsers();
        }
      });
    }


  }
