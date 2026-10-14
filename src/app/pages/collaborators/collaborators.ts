import { Component, OnInit, signal } from '@angular/core';
import { Collaborator as CollaboratorComponent } from '../../components/collaborator/collaborator';
import { Collaborator as CollaboratorModel } from '../../models/collaborator-response';
import { CollaboratorService } from '../../services/collaborator-service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CollaboratorComponent, RouterLink],
  selector: 'app-collaborators',
  styleUrl: './collaborators.css',
  templateUrl: './collaborators.html',
})
  
export class Collaborators implements OnInit {

  collaborators = signal<CollaboratorModel[]>([]);
  
  constructor(private collaboratorService: CollaboratorService) { }
  
  ngOnInit(): void {
    this.refreshCollaborators();
  }

  public refreshCollaborators() {
    this.collaboratorService.getCollaborators().subscribe({
      next: (collaborators) => {
        console.log('Collaborators retrieved :', collaborators);
        this.collaborators.set(collaborators);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des collaborateurs :', error);
      }
    });
  }
}