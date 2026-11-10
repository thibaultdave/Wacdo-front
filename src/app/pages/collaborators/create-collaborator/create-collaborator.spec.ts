import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCollaborator } from './create-collaborator';
import { of, throwError } from 'rxjs';
import { CollaboratorService } from '../../../services/collaborator/collaborator-service';
import { Router } from '@angular/router';

describe('CreateCollaborator', () => {
  let component: CreateCollaborator;
  let fixture: ComponentFixture<CreateCollaborator>;
  let collaboratorServiceSpy: {
    createCollaborator: ReturnType<typeof vi.fn>;
    emailExists: ReturnType<typeof vi.fn>;
  };
  let routerSpy: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    collaboratorServiceSpy = {
      createCollaborator: vi.fn(),
      emailExists: vi.fn().mockReturnValue(of(false))
    };

    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CreateCollaborator],
      providers: [
        { provide: CollaboratorService, useValue: collaboratorServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCollaborator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // FORM VALIDATION

  describe('Form validation', () => {

    it('should initialize the form with default values', () => {
      expect(component.collaboratorForm).toBeDefined();

      expect(component.collaboratorForm.value).toEqual({
        firstName: '',
        name: '',
        email: '',
        firstHireDate: '',
        admin: false,
        password: ''
      });
    });

    it('should have an invalid form when empty', () => {
      expect(component.collaboratorForm.valid).toBe(false);
      expect(component.collaboratorForm.controls['firstName'].valid).toBe(false);
      expect(component.collaboratorForm.controls['name'].valid).toBe(false);
      expect(component.collaboratorForm.controls['email'].valid).toBe(false);
      expect(component.collaboratorForm.controls['firstHireDate'].valid).toBe(false);
      expect(component.collaboratorForm.controls['password'].valid).toBe(false);
    });

    it('should have a valid form when all fields are correctly filled', () => {
      component.collaboratorForm.setValue({
        firstName: 'Jean',
        name: 'Dupont',
        email: 'jean.dupont@test.fr',
        firstHireDate: '2024-01-15',
        admin: false,
        password: 'password123'
      });

      expect(component.collaboratorForm.valid).toBe(true);
    });

    it('should not create a collaborator when the form is invalid', () => {
      component.createCollaborator();

      expect(collaboratorServiceSpy.createCollaborator).not.toHaveBeenCalled();
      expect(component.collaboratorForm.get('firstName')?.touched).toBe(true);
      expect(component.collaboratorForm.get('name')?.touched).toBe(true);
      expect(component.collaboratorForm.get('email')?.touched).toBe(true);
      expect(component.collaboratorForm.get('firstHireDate')?.touched).toBe(true);
      expect(component.collaboratorForm.get('password')?.touched).toBe(true);
    });
  });

  // VALIDATORS

  describe('Form validators', () => {

    // firstName
    it('should require firstName', () => {
      const control = component.collaboratorForm.get('firstName');

      expect(control?.hasError('required')).toBe(true);
    });

    it('should make firstName valid when provided', () => {
      const control = component.collaboratorForm.get('firstName');
      control?.setValue('Jean');

      expect(control?.hasError('required')).toBe(false);
      expect(control?.valid).toBe(true);
    });

    // name
    it('should require name', () => {
      const control = component.collaboratorForm.get('name');

      expect(control?.hasError('required')).toBe(true);
    });

    it('should make name valid when provided', () => {
      const control = component.collaboratorForm.get('name');
      control?.setValue('Dupont');

      expect(control?.hasError('required')).toBe(false);
      expect(control?.valid).toBe(true);
    });

    // email
    it('should require email', () => {
      const control = component.collaboratorForm.get('email');

      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const control = component.collaboratorForm.get('email');

      control?.setValue('invalid-email');

      expect(control?.hasError('email')).toBe(true);
    });

    it('should make email valid when provided', () => {
      const control = component.collaboratorForm.get('email');
      control?.setValue('jean.dupont@test.fr');

      expect(control?.hasError('required')).toBe(false);
      expect(control?.hasError('email')).toBe(false);
      expect(control?.valid).toBe(true);
    });

    // firstHireDate
    it('should require firstHireDate', () => {
      const control = component.collaboratorForm.get('firstHireDate');

      expect(control?.hasError('required')).toBe(true);
    });

    it('should reject a future firstHireDate', () => {
      const control = component.collaboratorForm.get('firstHireDate');

      control?.setValue('2099-01-01');
      
      expect(control?.hasError('futureDate')).toBe(true);
    });

    it('should make firstHireDate valid when provided', () => {
      const control = component.collaboratorForm.get('firstHireDate');
      control?.setValue('2024-01-15');

      expect(control?.hasError('required')).toBe(false);
      expect(control?.hasError('futureDate')).toBe(false);
      expect(control?.valid).toBe(true);
    });

    // password
    it('should require password', () => {
      const control = component.collaboratorForm.get('password');

      expect(control?.hasError('required')).toBe(true);
    });

    it('should reject a password shorter than 8 characters', () => {
      const control = component.collaboratorForm.get('password');

      control?.setValue('1234567');

      expect(control?.hasError('minlength')).toBe(true);
    });

    it('should make password valid when provided', () => {
      const control = component.collaboratorForm.get('password');
      control?.setValue('password123');

      expect(control?.hasError('required')).toBe(false);
      expect(control?.hasError('minlength')).toBe(false);
      expect(control?.valid).toBe(true);
    });
  });

  // ASYNC VALIDATORS

  describe('Async validators', () => {

    it('should reject an email that already exists', () => {
      collaboratorServiceSpy.emailExists.mockReturnValue(of(true));

      const control = component.collaboratorForm.get('email');
      control?.setValue('jean.dupont@test.fr');

      expect(collaboratorServiceSpy.emailExists)
        .toHaveBeenCalledWith('jean.dupont@test.fr');

      expect(control?.hasError('emailAlreadyExists')).toBe(true);
    });

    it('should accept an available email', () => {
      collaboratorServiceSpy.emailExists.mockReturnValue(of(false));

      const control = component.collaboratorForm.get('email');
      control?.setValue('nouveau@test.fr');

      expect(control?.hasError('emailAlreadyExists')).toBe(false);
      expect(control?.valid).toBe(true);
    });
  });

  // CREATE COLLABORATOR
  
  describe('createCollaborator', () => {

    it('should create a collaborator and navigate on success', () => {
      const collaborator = {
        firstName: 'Jean',
        name: 'Dupont',
        email: 'jean.dupont@test.fr',
        firstHireDate: '2024-01-15',
        admin: false,
        password: 'password123'
      };

      collaboratorServiceSpy.createCollaborator.mockReturnValue(of({}));

      component.collaboratorForm.setValue(collaborator);
      component.createCollaborator();

      expect(collaboratorServiceSpy.createCollaborator)
        .toHaveBeenCalledWith(collaborator);

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/collaborators']);
    });

    it('should handle an error when creating a collaborator', () => {
      const error = new Error('Creation failed');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      collaboratorServiceSpy.createCollaborator.mockReturnValue(
        throwError(() => error)
      );

      component.collaboratorForm.setValue({
        firstName: 'Jean',
        name: 'Dupont',
        email: 'jean.dupont@test.fr',
        firstHireDate: '2024-01-15',
        admin: false,
        password: 'password123'
      });

      component.createCollaborator();

      expect(collaboratorServiceSpy.createCollaborator).toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error creating collaborator:',
        error
      );

      consoleErrorSpy.mockRestore();
    });
  });
});