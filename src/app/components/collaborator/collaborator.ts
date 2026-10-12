import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Collaborator as CollaboratorModel } from '../../models/collaborator-response';

@Component({
  selector: 'app-collaborator',
  imports: [],
  templateUrl: './collaborator.html',
  styleUrl: './collaborator.css'
})
export class Collaborator {

  @Input() collaborator!: CollaboratorModel;

  public changeDateFormat(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /*constructor(private http: HttpClient) {

  }

  public deleteCollaborator() {
    this.http.delete(`http://localhost:8080/api/collaborators/${this.collaborator.id}`, {
      headers: { 'Bearer '+ localStorage.getItem('token') }
    }).subscribe({
      next: () => {
        console.log(`Collaborator deleted: ${this.collaborator.firstName} ${this.collaborator.name}`);
      },
      error: (error) => {
        console.error('Error deleting collaborator:', error);
      }
    });
  }*/
}