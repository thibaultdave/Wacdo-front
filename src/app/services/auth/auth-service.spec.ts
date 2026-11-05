import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth-service';
import { environment } from '../../../environments/environment';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

function createToken(expiration: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));

  const payload = btoa(JSON.stringify({
    exp: Math.floor(expiration / 1000)
  }));

  return `${header}.${payload}.signature`;
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    service.logout();
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be authenticated when no token exists', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  // LOGIN

  it('should login and store the token on success', () => {
    const token = createToken(Date.now() + 3600000);

    service.login({
      email: 'test@test.com',
      password: 'password'
    }).subscribe();

    const request = httpMock.expectOne(`${apiUrl}/login`);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      email: 'test@test.com',
      password: 'password'
    });

    request.flush({ token });

    expect(localStorage.getItem('token')).toBe(token);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should not authenticate when login fails', () => {
    service.login({
      email: 'test@test.com',
      password: 'wrongPassword'
    }).subscribe({
      error: () => {}
    });

    const request = httpMock.expectOne(`${apiUrl}/login`);

    request.flush(
      { message: 'Unauthorized' },
      { status: 401, statusText: 'Unauthorized' }
    );

    expect(localStorage.getItem('token')).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  // LOGOUT

  it('should logout and remove the token', () => {
    const token = createToken(Date.now() + 3600000);

    localStorage.setItem('token', token);

    service.checkAuthentication();

    expect(service.isAuthenticated()).toBe(true);

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  // CHECK AUTHENTICATION

  it('should logout when token is invalid', () => {
    localStorage.setItem('token', 'invalid-token');

    expect(service.checkAuthentication()).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should return true when token is valid', () => {
    const token = createToken(Date.now() + 3600000);

    localStorage.setItem('token', token);

    expect(service.checkAuthentication()).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should logout when token is expired', () => {
    const token = createToken(Date.now() - 6000);

    localStorage.setItem('token', token);

    expect(service.checkAuthentication()).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  // SESSION EXPIRATION

  it('should logout and navigate to login when session expires', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    const token = createToken(Date.now() + 3600000);
    localStorage.setItem('token', token);

    service.checkAuthentication();

    service.expireSession();

    expect(localStorage.getItem('token')).toBeNull();
    expect(service.isAuthenticated()).toBe(false);

    expect(navigateSpy).toHaveBeenCalledWith(['/login'], {
      state: { sessionExpired: true }
    });
  });
});