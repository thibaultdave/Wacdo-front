import { Component, OnInit, signal, computed } from '@angular/core';
import { Collaborator as CollaboratorComponent } from '../../components/collaborator/collaborator';
import { Collaborator as CollaboratorModel } from '../../models/collaborator-response';
import { CollaboratorService } from '../../services/collaborator/collaborator-service';
import { RouterLink } from '@angular/router';
import { Filter } from '../../components/filter/filter';

@Component({
  imports: [CollaboratorComponent, RouterLink, Filter],
  selector: 'app-collaborators',
  styleUrl: './collaborators.css',
  templateUrl: './collaborators.html',
})
  
export class Collaborators implements OnInit {

  collaborators = signal<CollaboratorModel[]>([]);

  nameFilter = signal('');
  firstNameFilter = signal('');
  emailFilter = signal('');

  filteredCollaborators = computed(() => {
    const name = this.nameFilter().trim().toLocaleLowerCase('fr-FR');
    const firstName = this.firstNameFilter().trim().toLocaleLowerCase('fr-FR');
    const email = this.emailFilter().trim().toLocaleLowerCase('fr-FR');

    return this.collaborators().filter(collaborator =>
      collaborator.name.toLocaleLowerCase('fr-FR').includes(name) &&
      collaborator.firstName.toLocaleLowerCase('fr-FR').includes(firstName) &&
      collaborator.email.toLocaleLowerCase('fr-FR').includes(email)
    );
  });
  
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
        console.error('Error retrieving collaborators :', error);
      }
    });
  }
}