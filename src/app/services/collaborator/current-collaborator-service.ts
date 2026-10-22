import { Injectable, computed, signal } from '@angular/core';

import { Collaborator } from '../../models/collaborator-response';
import { CollaboratorService } from './collaborator-service';

@Injectable({
  providedIn: 'root'
})
export class CurrentCollaboratorService {

    private readonly collaborator = signal<Collaborator | null>(null);

    readonly currentCollaborator = this.collaborator.asReadonly();

    readonly isAdmin = computed(
        () => this.collaborator()?.admin === true
    );

    constructor(private collaboratorService: CollaboratorService) { }

    public loadCurrentCollaborator() {
        this.collaboratorService.getCurrentCollaborator().subscribe({
            next: collaborator => {
                this.collaborator.set(collaborator);
            },
            error: error => {
                console.error('Error retrieving current user:', error);
                this.clearCurrentCollaborator();
            }
        });
    }

    public clearCurrentCollaborator() {
        this.collaborator.set(null);
    }
}