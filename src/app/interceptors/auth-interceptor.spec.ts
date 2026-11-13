import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../services/auth/auth-service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  let authServiceSpy: {
    isAuthenticated: ReturnType<typeof vi.fn>;
    expireSession: ReturnType<typeof vi.fn>;
  };

  const apiUrl = '/api/test';

  beforeEach(() => {
    localStorage.clear();

    authServiceSpy = {
      isAuthenticated: vi.fn().mockReturnValue(true),
      expireSession: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should add the Authorization header when a token exists', () => {
    localStorage.setItem('token', 'test-token');

    http.get(apiUrl).subscribe();

    const req = httpMock.expectOne(apiUrl);

    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');

    req.flush({});
  });

  it('should not add the Authorization header when no token exists', () => {
    http.get(apiUrl).subscribe();

    const req = httpMock.expectOne(apiUrl);

    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush({});
  });

  it('should not add the Authorization header to login requests', () => {
    localStorage.setItem('token', 'test-token');

    http.post('/auth/login', {}).subscribe();

    const req = httpMock.expectOne('/auth/login');

    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush({});
  });

  it('should expire the session when a request returns 401', () => {
    http.get(apiUrl).subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne(apiUrl);

    req.flush(null, {
      status: 401,
      statusText: 'Unauthorized',
    });

    expect(authServiceSpy.expireSession).toHaveBeenCalledOnce();
  });

  it('should not expire the session on a login request returning 401', () => {
    http.post('/auth/login', {}).subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne('/auth/login');

    req.flush(null, {
      status: 401,
      statusText: 'Unauthorized',
    });

    expect(authServiceSpy.expireSession).not.toHaveBeenCalled();
  });

  it('should not expire the session when the user is not authenticated', () => {
    authServiceSpy.isAuthenticated.mockReturnValue(false);

    http.get(apiUrl).subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne(apiUrl);

    req.flush(null, {
      status: 401,
      statusText: 'Unauthorized',
    });

    expect(authServiceSpy.expireSession).not.toHaveBeenCalled();
  });

  it('should not expire the session when another HTTP error occurs', () => {
    http.get(apiUrl).subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne(apiUrl);

    req.flush(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(authServiceSpy.expireSession).not.toHaveBeenCalled();
  });
});