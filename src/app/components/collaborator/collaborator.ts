import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Collaborator as CollaboratorModel } from '../../models/collaborator-response';
import { CollaboratorService } from '../../services/collaborator-service';

@Component({
  selector: 'app-collaborator',
  imports: [],
  templateUrl: './collaborator.html',
  styleUrl: './collaborator.css'
})
export class Collaborator {

  @Input() collaborator!: CollaboratorModel;
  @Output() collaboratorsUpdated = new EventEmitter<boolean>();

  isSameUser(): boolean {
    const userEmail = localStorage.getItem('userEmail');
    return userEmail === this.collaborator.email;
  }

  public changeDateFormat(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  constructor(private collaboratorService: CollaboratorService) {  }

  public deleteCollaborator() {
    this.collaboratorService.removeCollaborator(this.collaborator.id).subscribe({
      next: () => {
        this.collaboratorsUpdated.emit(true);
        console.log(`Collaborator deleted: ${this.collaborator.firstName} ${this.collaborator.name}`);
      },
      error: (error) => {
        console.error('Error deleting collaborator:', error);
      }
    });
  }
}