import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth/auth-service';

describe('authGuard', () => {
  let authServiceSpy: {
    checkAuthentication: ReturnType<typeof vi.fn>;
  };

  let router: Router;
  
  beforeEach(() => {
    authServiceSpy = {
      checkAuthentication: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([]),
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should allow access when authenticated', () => {
    authServiceSpy.checkAuthentication.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      )
    );

    expect(result).toBe(true);
    expect(authServiceSpy.checkAuthentication).toHaveBeenCalledOnce();
  });

  it('should redirect to login when not authenticated', () => {
    authServiceSpy.checkAuthentication.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      )
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
    expect(authServiceSpy.checkAuthentication).toHaveBeenCalledOnce();
  });
});
