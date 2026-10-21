import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth-service';
import { CollaboratorService } from '../../services/collaborator-service';
import { Collaborator as CollaboratorModel } from '../../models/collaborator-response';

@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly currentCollaborator = signal<CollaboratorModel | null>(null);

  readonly isAuthenticated = this.authService.isAuthenticated;

  menuOpen = signal(false);

  constructor(private collaboratorService: CollaboratorService) {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.retrieveCurrentCollaborator();
      } else {
        this.currentCollaborator.set(null);
      }
    });
  }

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

  private retrieveCurrentCollaborator() {
    this.collaboratorService.getCurrentCollaborator().subscribe({
      next: collaborator => {
        this.currentCollaborator.set(collaborator);
      },
      error: error => {
        console.error('Error retrieving current user: ', error);
        this.currentCollaborator.set(null);
      }
    });
  }
}