
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = environment.apiUrl;

  private readonly authenticated = signal(
    localStorage.getItem('token') !== null
  );

  readonly isAuthenticated = this.authenticated.asReadonly();

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      request
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.authenticated.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authenticated.set(false);
  }
}