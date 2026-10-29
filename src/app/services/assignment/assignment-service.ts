import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Assignment as AssignmentResponse } from '../../models/assignment-response';
import { AssignmentRequest } from '../../models/assignment-request';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

    private readonly apiUrl = `${environment.apiUrl}/api/assignments`;
    
    constructor(private http: HttpClient) { }

    getAssignments(): Observable<AssignmentResponse[]> {
        return this.http.get<AssignmentResponse[]>(`${this.apiUrl}`);
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