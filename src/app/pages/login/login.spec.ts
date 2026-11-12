import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../services/auth/auth-service';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceSpy: { login: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = {
      login: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // FORM VALIDATION

  describe('validForm', () => {

    it('should have an invalid form when empty', () => {
      expect(component.loginForm.valid).toBe(false);
      expect(component.loginForm.controls['email'].valid).toBe(false);
      expect(component.loginForm.controls['password'].valid).toBe(false);
    });

    it('should have a valid form when credentials are provided', () => {
      component.loginForm.setValue({
        email: 'test@test.com',
        password: 'password'
      });

      expect(component.loginForm.valid).toBe(true);
    });

    it('should mark all controls as touched when form is invalid', () => {
      component.onLogin();

      expect(component.loginForm.controls['email'].touched).toBe(true);
      expect(component.loginForm.controls['password'].touched).toBe(true);
      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });
  });

  // LOGIN

  describe('login', () => {
    
    it('should call api and navigate on success', () => {
      authServiceSpy.login.mockReturnValue(of({ token: 'mockToken' }));
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.loginForm.setValue({
        email: 'test@test.com',
        password: 'password'
      });

      component.onLogin();

      expect(authServiceSpy.login).toHaveBeenCalledOnce();
      expect(authServiceSpy.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password'
      });

      expect(navigateSpy).toHaveBeenCalledWith(['/home']);
      expect(component.errorMessage()).toBe('');
    });

    it('should display an error message when login fails', () => {
      authServiceSpy.login.mockReturnValue(
        throwError(() => new Error('Invalid credentials'))
      );

      component.loginForm.setValue({
        email: 'test@test.com',
        password: 'wrongPassword'
      });

      component.onLogin();

      expect(component.errorMessage()).toBe(
        'Email ou mot de passe incorrect.'
      );
    });
  });

  // QUICK LOGIN

  describe('loginQuicly', () => {

    it('should autofill admin credentials', () => {
      component.autoFillAdmin();

      expect(component.loginForm.value).toEqual({
        email: 'admin@test.fr',
        password: 'password123'
      });
    });

    it('should autofill user credentials', () => {
      component.autoFillUser();

      expect(component.loginForm.value).toEqual({
        email: 'user@test.fr',
        password: 'password456'
      });
    });
  });
});