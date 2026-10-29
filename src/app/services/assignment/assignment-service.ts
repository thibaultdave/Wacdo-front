import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Job as JobResponse } from '../../models/job-response';
import { JobRequest } from '../../models/job-request';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

    private readonly apiUrl = `${environment.apiUrl}/api/assignments`;
    
    constructor(private http: HttpClient) { }

    getAssignments(): Observable<JobResponse[]> {
        return this.http.get<JobResponse[]>(`${this.apiUrl}`);
    }

    getAssignmentById(id: string | null): Observable<JobResponse> {
        return this.http.get<JobResponse>(`${this.apiUrl}/${id}`);
        }
    
    removeAssignment(id: number): Observable<void> { 
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    
    createAssignment(jobRequest: JobRequest): Observable<JobResponse> {
        return this.http.post<JobResponse>(`${this.apiUrl}`, jobRequest);
    }
    
    updateAssignment(id: string | null, jobRequest: JobRequest): Observable<JobResponse> {
        return this.http.put<JobResponse>(`${this.apiUrl}/${id}`, jobRequest);
    }
}
