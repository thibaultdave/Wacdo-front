import { Component, signal, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

import { AuthService } from './services/auth/auth-service';
import { CurrentCollaboratorService } from './services/collaborator/current-collaborator-service';

@Component({
  imports: [RouterOutlet, Header, Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Wacdo-front');

  constructor(
    public authService: AuthService,
    public currentCollaborator: CurrentCollaboratorService
  ) {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.currentCollaborator.loadCurrentCollaborator();
      } else {
        this.currentCollaborator.clearCurrentCollaborator();
      }
    });
  }
}