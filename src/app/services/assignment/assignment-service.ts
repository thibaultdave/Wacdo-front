import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { AssignmentResponse } from '../../models/assignment-response';
import { AssignmentRequest } from '../../models/assignment-request';
import { environment } from '../../../environments/environment';
import { Assignment as AssignmentModel } from '../../models/assignment';
import { mapAssignment } from '../../mappers/assignment.mapper';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

    private readonly apiUrl = `${environment.apiUrl}/api/assignments`;
    
    constructor(private http: HttpClient) { }

    getAssignments(): Observable<AssignmentModel[]> {
        return this.http.get<AssignmentResponse[]>(`${this.apiUrl}`)
            .pipe(
                map(assignments => assignments.map(mapAssignment))
            );
    }

    getAssignmentById(id: string | null): Observable<AssignmentResponse> {
        return this.http.get<AssignmentResponse>(`${this.apiUrl}/${id}`);
        }
    
    removeAssignment(id: number): Observable<void> { 
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    
    createAssignment(assignmentRequest: AssignmentRequest): Observable<AssignmentResponse> {
        return this.http.post<AssignmentResponse>(`${this.apiUrl}`, assignmentRequest);
    }
    
    updateAssignment(id: string | null, assignmentRequest: AssignmentRequest): Observable<AssignmentResponse> {
        return this.http.put<AssignmentResponse>(`${this.apiUrl}/${id}`, assignmentRequest);
    }
}