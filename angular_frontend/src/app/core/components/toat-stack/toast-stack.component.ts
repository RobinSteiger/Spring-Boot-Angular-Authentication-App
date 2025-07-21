import { ChangeDetectionStrategy, Component, effect, inject } from "@angular/core";
import { Alert } from "../../constants/alert.constants";
import { AlertStore } from "../../services/ui/alert.store";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-toast-stack',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastStackComponent {
  private readonly alertStore = inject(AlertStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly toastedAlertIds = new Set<string>();

  readonly alerts = this.alertStore.alerts;

  constructor() {
    effect(() => {
      for (const alert of this.alerts()) {
        if (!this.toastedAlertIds.has(alert.id)) {
          this.snackBar.open(alert.message, '×', {
            duration: alert.duration ?? 4000,
            panelClass: [`alert--${alert.type}`],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }).afterDismissed().subscribe(() => {
            this.removeFromAlerts(alert);
          });
          this.toastedAlertIds.add(alert.id);
        }
      }
    });
  }

  removeFromAlerts(alert: Alert) {
    this.alertStore.removeAlert(alert);
    this.toastedAlertIds.delete(alert.id);
  }
}