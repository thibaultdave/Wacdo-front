import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth-service';

@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly userEmail = localStorage.getItem('userEmail');

  readonly isAuthenticated = this.authService.isAuthenticated;

  menuOpen = signal(false);

toggleMenu(): void {
  this.menuOpen.update(open => !open);
}

closeMenu(): void {
  this.menuOpen.set(false);
}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}