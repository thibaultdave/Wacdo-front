import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Collaborator } from '../models/collaborator-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {

  private readonly apiUrl = `${environment.apiUrl}/api/collaborators`;

  constructor(private http: HttpClient) {}

  getCollaborators(): Observable<Collaborator[]> {
    return this.http.get<Collaborator[]>(this.apiUrl);
  }
}