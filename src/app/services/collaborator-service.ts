import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Collaborator as CollaboratorResponse } from '../models/collaborator-response';
import { CollaboratorRequest } from '../models/collaborator-request';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {

  private readonly apiUrl = `${environment.apiUrl}/api/collaborators`;

  constructor(private http: HttpClient) {}

  getCollaborators(): Observable<CollaboratorResponse[]> {
    return this.http.get<CollaboratorResponse[]>(`${this.apiUrl}`);
  }

  getCollaboratorById(id: number): Observable<CollaboratorResponse> {
    return this.http.get<CollaboratorResponse>(`${this.apiUrl}/${id}`);
  }

  removeCollaborator(id: number): Observable<void> { 
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createCollaborator(collaboratorRequest: CollaboratorRequest): Observable<CollaboratorResponse> {
    return this.http.post<CollaboratorResponse>(`${this.apiUrl}`, collaboratorRequest);
  }

  updateCollaborator(id: number, collaboratorRequest: CollaboratorRequest): Observable<CollaboratorResponse> {
    return this.http.put<CollaboratorResponse>(`${this.apiUrl}/${id}`, collaboratorRequest);
  }
}