import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Theme, ThemeManagerService } from '../../services/ui/theme-manager.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-theme-button',
  imports: [
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template:`
    <button mat-icon-button (click)="toggleTheme()" class="button--icon">
        @if (themeSelected() === Theme.DARK) {
            <mat-icon>brightness_high</mat-icon>
        } @else {
            <mat-icon>brightness_3</mat-icon>
        }
    </button>
  `
})
export class ThemeButtonComponent {
  private readonly themeManagerService = inject(ThemeManagerService);

  readonly themeSelected = this.themeManagerService.themeSelected;
  readonly Theme = Theme;

  toggleTheme() {
    if (this.themeSelected() === Theme.DARK) {
      this.themeManagerService.setTheme(Theme.LIGHT);
    } else {
      this.themeManagerService.setTheme(Theme.DARK);
    }
  }
}