import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { ToastStackComponent } from "./core/components/toat-stack/toast-stack.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
    RouterOutlet,
    HeaderComponent,
    ToastStackComponent
],
    template: `
    <app-toast-stack />
    <app-header />
    <router-outlet />
  `,
    styles: []
})
export class AppComponent {
  title = 'angular_frontend';
}
