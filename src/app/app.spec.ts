import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutlet, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from './app';
import { AuthService } from './services/auth/auth-service';
import { CurrentCollaboratorService } from './services/collaborator/current-collaborator-service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: '<header>Header test</header>',
})
class HeaderStub {}

@Component({
  selector: 'app-footer',
  standalone: true,
  template: '<footer>Footer test</footer>',
})
class FooterStub {}

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let component: App;

  let isAuthenticatedSignal: ReturnType<typeof signal<boolean>>;
  let isAdminSignal: ReturnType<typeof signal<boolean>>;

  let authServiceSpy: {
    isAuthenticated: typeof isAuthenticatedSignal;
  };

  let currentCollaboratorServiceSpy: {
    loadCurrentCollaborator: ReturnType<typeof vi.fn>;
    clearCurrentCollaborator: ReturnType<typeof vi.fn>;
    isAdmin: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    isAuthenticatedSignal = signal(false);
    isAdminSignal = signal(false);

    authServiceSpy = {
      isAuthenticated: isAuthenticatedSignal,
    };

    currentCollaboratorServiceSpy = {
      loadCurrentCollaborator: vi.fn(),
      clearCurrentCollaborator: vi.fn(),
      isAdmin: vi.fn(() => isAdminSignal()),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: CurrentCollaboratorService,
          useValue: currentCollaboratorServiceSpy,
        },
      ],
    })
      .overrideComponent(App, {
        set: {
          imports: [RouterOutlet, HeaderStub, FooterStub],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // LOGIC TEST

  describe('logic test', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load current collaborator when authenticated', () => {
      isAuthenticatedSignal.set(true);
      fixture.detectChanges();

      expect(
        currentCollaboratorServiceSpy.loadCurrentCollaborator
      ).toHaveBeenCalled();
    });

    it('should clear current collaborator when not authenticated', () => {
      isAuthenticatedSignal.set(true);
      fixture.detectChanges();

      isAuthenticatedSignal.set(false);
      fixture.detectChanges();

      expect(
        currentCollaboratorServiceSpy.clearCurrentCollaborator
      ).toHaveBeenCalled();
    });
  });

  // TEMPLATE TEST

  describe('template test', () => {

    it('should display header and footer', () => {
      const header = fixture.nativeElement.querySelector('app-header');
      const footer = fixture.nativeElement.querySelector('app-footer');

      expect(header).not.toBeNull();
      expect(footer).not.toBeNull();
    });

    it('should display router outlet when not authenticated', () => {
      const outlet = fixture.nativeElement.querySelector('router-outlet');
      const message = fixture.nativeElement.querySelector('main p');

      expect(outlet).not.toBeNull();
      expect(message).toBeNull();
    });

    it('should display router outlet when authenticated as admin', () => {
      isAuthenticatedSignal.set(true);
      isAdminSignal.set(true);

      fixture.detectChanges();

      const outlet = fixture.nativeElement.querySelector('router-outlet');
      const message = fixture.nativeElement.querySelector('main p');

      expect(outlet).not.toBeNull();
      expect(message).toBeNull();
    });

    it('should display access denied message when authenticated as non-admin', () => {
      isAuthenticatedSignal.set(true);
      isAdminSignal.set(false);

      fixture.detectChanges();

      const outlet = fixture.nativeElement.querySelector('router-outlet');
      const message = fixture.nativeElement.querySelector('main p');

      expect(outlet).toBeNull();
      expect(message).not.toBeNull();
      expect(message.textContent).toContain(
        "Vous n'avez pas les droits administrateurs"
      );
    });
  });
});