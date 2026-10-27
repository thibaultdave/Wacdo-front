import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Job as JobResponse } from '../../models/job-response';
import { JobRequest } from '../../models/job-request';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {

    private readonly apiUrl = `${environment.apiUrl}/api/jobs`;
    
    constructor(private http: HttpClient) { }
    
    getJobs(): Observable<JobResponse[]> {
        return this.http.get<JobResponse[]>(`${this.apiUrl}`);
    }

    getJobById(id: string | null): Observable<JobResponse> {
        return this.http.get<JobResponse>(`${this.apiUrl}/${id}`);
        }
    
    removeJob(id: number): Observable<void> { 
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    
    createJob(jobRequest: JobRequest): Observable<JobResponse> {
        return this.http.post<JobResponse>(`${this.apiUrl}`, jobRequest);
    }
    
    updateJob(id: string | null, jobRequest: JobRequest): Observable<JobResponse> {
        return this.http.put<JobResponse>(`${this.apiUrl}/${id}`, jobRequest);
    }
}
