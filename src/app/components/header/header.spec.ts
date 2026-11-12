import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { signal } from '@angular/core';
import { CurrentCollaboratorService } from '../../services/collaborator/current-collaborator-service';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let authServiceSpy: {
    isAuthenticated: ReturnType<typeof signal<boolean>>;
    logout: ReturnType<typeof vi.fn>;
  };
  let currentCollaboratorServiceSpy: object;

  beforeEach(async () => {
    authServiceSpy = {
      isAuthenticated: signal(true),
      logout: vi.fn(),
    };

    currentCollaboratorServiceSpy = {currentCollaborator: signal(null)};

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: CurrentCollaboratorService,
          useValue: currentCollaboratorServiceSpy,
        },
        provideRouter([])
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the authentication state', () => {
    expect(component.isAuthenticated()).toBe(true);

    authServiceSpy.isAuthenticated.set(false);

    expect(component.isAuthenticated()).toBe(false);
  });

  // MENU TOGGLE

  describe('toggleMenu', () => {
    it('should have the menu closed initially', () => {
      expect(component.menuOpen()).toBe(false);
    });

    it('should open the menu when toggleMenu is called', () => {
      component.toggleMenu();

      expect(component.menuOpen()).toBe(true);
    });

    it('should close the menu when toggleMenu is called twice', () => {
      component.toggleMenu();
      component.toggleMenu();

      expect(component.menuOpen()).toBe(false);
    });

    it('should close the menu when closeMenu is called', () => {
      component.toggleMenu();

      component.closeMenu();

      expect(component.menuOpen()).toBe(false);
    });
  });

  // LOGOUT

  describe('logout', () => {
    it('should logout and navigate to login', () => {
      const router = TestBed.inject(Router);
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.logout();

      expect(authServiceSpy.logout).toHaveBeenCalledOnce();
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });
  });
});