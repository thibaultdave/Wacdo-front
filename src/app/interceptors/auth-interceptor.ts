import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  // Ignore login requests to avoid adding Authorization header and prevent infinite 401 errors
  const isLoginRequest = req.url.includes('/auth/login');

  const request = !isLoginRequest && token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse
        && error.status === 401
        && !isLoginRequest
        && authService.isAuthenticated()
      ) {
        authService.expireSession();
      }

      return throwError(() => error);
    })
  );
};