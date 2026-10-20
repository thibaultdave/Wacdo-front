
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly authenticated = signal(
    localStorage.getItem('token') !== null
  );
  readonly isAuthenticated = this.authenticated.asReadonly();
  
  private expirationTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly maxTimerDelay = 2_147_000_000;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthentication();
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      request
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userEmail', request.email);
        this.authenticated.set(true);
        this.scheduleTokenExpiration();
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    this.authenticated.set(false);
  }

  // Check if the token is valid and not expired
  public checkAuthentication(): boolean {
    const token = localStorage.getItem('token');

    if (!this.isTokenValidAndNotExpired(token)) {
      this.logout();
      return false;
    }

    this.authenticated.set(true);
    this.scheduleTokenExpiration();
    return true;
  }

  private isTokenValidAndNotExpired(token: string | null): boolean {
    if (!token) {
      return false;
    }

    return this.getTokenExpiration(token) !== null;
  }

  // Schedule the token expiration check to prevent the user from staying logged in with an expired token
  private scheduleTokenExpiration() {
    
    if (this.expirationTimer !== null) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = null;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    const expiration = this.getTokenExpiration(token);

    if (expiration === null) {
      this.logout();
      return;
    }

    const remainingTime = expiration - Date.now();
    console.log(`Token expiration in ${remainingTime} ms`);

    if (remainingTime <= 0) {
      this.expireSession();
      return;
    }

    const delay = Math.min(remainingTime, this.maxTimerDelay);

    this.expirationTimer = setTimeout(() => {
      this.scheduleTokenExpiration();
    }, delay);
  }

  public expireSession() {
    this.logout();

    this.router.navigate(['/login'], {
      state: { sessionExpired: true }
    });
  }

  private getTokenExpiration(token: string): number | null {
    try {
      const parts = token.split('.');

      if (parts.length !== 3 || !parts[1]) {
        return null;
      }

      const base64 = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const paddedBase64 = base64.padEnd(
        Math.ceil(base64.length / 4) * 4,
        '='
      );

      const payload = JSON.parse(atob(paddedBase64));

      if (typeof payload.exp !== 'number' || !Number.isFinite(payload.exp)) {
        return null;
      }

      return payload.exp * 1000;
    } catch {
      return null;
    }
  }
}