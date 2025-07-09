import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ADMIN_URLS, AUTH_URLS, ROOT_URLS } from '../../constants/urls.constants';
import { CommonModule } from '@angular/common';
import { Router, RouterModule} from '@angular/router';
import { ROOT_PATHS } from '../../constants/paths.constants';

@Component({
    selector: 'app-header',
    imports: [
      CommonModule,
      RouterModule,
      MatToolbarModule,
      MatIconModule,
      MatButtonModule,
      MatSidenavModule,
      MatListModule,
    ],
    templateUrl: 'footer.component.html',
    styleUrl: 'footer.component.scss',
})
export class FooterComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly ROOT_PATHS = ROOT_PATHS;
  readonly ROOT_URLS = ROOT_URLS;
  readonly AUTH_URLS = AUTH_URLS;
  readonly ADMIN_URLS = ADMIN_URLS;
  readonly isUserLoggedIn = () => this.authService.authState().isLoggedIn;

  logOutUser() {
    this.authService.logout();
    void this.router.navigate([ROOT_URLS.home]);
  }
}