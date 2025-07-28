import { Component, DestroyRef, inject } from "@angular/core";
import { AlertStore } from "../../../../../core/services/ui/alert.store";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { AdminService } from "../../../services/admin.service";
import { messages } from "../../../../../../resources/messages";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError, EMPTY } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: 'app-user-edit',
    imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
],
    templateUrl: 'user-delete.component.html',
    //styleUrl: 'user-delete.component.scss',
})
export class UserDeleteComponent {
  private readonly alertStore = inject(AlertStore);
  private readonly adminService = inject(AdminService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialogRef<UserDeleteComponent>);
  private readonly parameter = inject(MAT_DIALOG_DATA) as {userId : number};

  readonly messages = messages;

  constructor() {}

  ngOnInit(): void {}

  deleteUser() {
    console.log(this.parameter.userId);
      this.adminService.deleteUser(this.parameter.userId)
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
        this.alertStore.createSuccessAlert("User successfully deleted.");
        this.dialogRef.close('deleted');
      });
    }
}