import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCollaborator } from './update-collaborator';
import { NEVER, of, throwError } from 'rxjs';
import { CollaboratorService } from '../../../services/collaborator/collaborator-service';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { Collaborator as CollaboratorModel } from '../../../models/collaborator-response';

const mockCollaborator: CollaboratorModel = {
  id: 1,
  firstName: 'Jean',
  name: 'Dupont',
  email: 'ancien@test.fr',
  firstHireDate: '2024-01-15',
  admin: false,
  assignments: []
};

describe('UpdateCollaborator', () => {
  let component: UpdateCollaborator;
  let fixture: ComponentFixture<UpdateCollaborator>;
  let collaboratorServiceSpy: {
    updateCollaborator: ReturnType<typeof vi.fn>;
    emailExists: ReturnType<typeof vi.fn>;
    getCollaboratorById: ReturnType<typeof vi.fn>;
  };

  let routerSpy: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    collaboratorServiceSpy = {
      updateCollaborator: vi.fn(),
      emailExists: vi.fn().mockReturnValue(of(false)),
      getCollaboratorById: vi.fn().mockReturnValue(of(mockCollaborator)),
    };

    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [UpdateCollaborator],
      providers: [
        { provide: CollaboratorService, useValue: collaboratorServiceSpy },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' })
            }
          }
        },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCollaborator);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // FORM VALIDATION

  describe('Form validation', () => {
    it('should retrieve the collaborator on initialization', () => {
      expect(collaboratorServiceSpy.getCollaboratorById)
        .toHaveBeenCalledWith('1');
    });
    
    it('should initialize the form with collaborator data', () => {
      expect(component.collaboratorForm.value).toEqual({
        firstName: 'Jean',
        name: 'Dupont',
        email: 'ancien@test.fr',
        firstHireDate: '2024-01-15',
        admin: false,
        password: null
      });
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

    it('should have a valid form when all fields are correctly filled and without updating password', () => {
      component.collaboratorForm.setValue({
        firstName: 'Jean',
        name: 'Dupont',
        email: 'jean.dupont@test.fr',
        firstHireDate: '2024-01-15',
        admin: false,
        password: null
      });

      expect(component.collaboratorForm.valid).toBe(true);
    });

    it('should not update a collaborator when the form is invalid', () => {
      component.collaboratorForm.setValue({
        firstName: null,
        name: null,
        email: null,
        firstHireDate: null,
        admin: false,
        password: null
      });

      component.updateCollaborator();

      expect(collaboratorServiceSpy.updateCollaborator).not.toHaveBeenCalled();
      expect(component.collaboratorForm.get('firstName')?.touched).toBe(true);
      expect(component.collaboratorForm.get('name')?.touched).toBe(true);
      expect(component.collaboratorForm.get('email')?.touched).toBe(true);
      expect(component.collaboratorForm.get('firstHireDate')?.touched).toBe(true);
      expect(component.collaboratorForm.get('password')?.touched).toBe(true);
    });

    it('should handle an error when retrieving a collaborator', () => {
      const error = new Error('Fetch failed');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      collaboratorServiceSpy.getCollaboratorById.mockReturnValue(
        throwError(() => error)
      );

      const testFixture = TestBed.createComponent(UpdateCollaborator);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching collaborator:',
        error
      );

      testFixture.destroy();
      consoleErrorSpy.mockRestore();
    });
  });

  // VALIDATORS

  describe('Form validators', () => {

    // firstName
    it('should require firstName', () => {
      const control = component.collaboratorForm.get('firstName');
      control?.setValue(null);

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
      control?.setValue(null);

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
      control?.setValue(null);

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
      control?.setValue(null);

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

    it('should accept an empty password', () => {
      const control = component.collaboratorForm.get('password');

      control?.setValue('');

      expect(control?.valid).toBe(true);
    });

    it('should accept a null password', () => {
      const control = component.collaboratorForm.get('password');

      control?.setValue(null);

      expect(control?.valid).toBe(true);
    });
  });

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

    it('should accept the current email without calling emailExists', () => {
      const control = component.collaboratorForm.get('email');

      expect(control?.value).toBe(mockCollaborator.email);
      expect(control?.valid).toBe(true);

      expect(collaboratorServiceSpy.emailExists).not.toHaveBeenCalled();
    });
  });

  // UPDATE COLLABORATOR

  describe('Update collaborator', () => {

    it('should update a collaborator and navigate on success', () => {
      const collaborator = {
        firstName: 'Jean',
        name: 'Dupont',
        email: 'jean.dupont@test.fr',
        firstHireDate: '2024-01-15',
        admin: false,
        password: 'password123'
      };

      collaboratorServiceSpy.updateCollaborator.mockReturnValue(of({}));
      
      component.collaboratorForm.setValue(collaborator);
      expect(component.collaboratorForm.status).toBe('VALID');
      component.updateCollaborator();

      expect(collaboratorServiceSpy.updateCollaborator).toHaveBeenCalledOnce();
      expect(collaboratorServiceSpy.updateCollaborator).toHaveBeenCalledWith(
        '1',
        collaborator
      );

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/collaborators']);
    });

    it('should update a collaborator without changing the password', () => {
      const collaborator = {
        firstName: 'Jean',
        name: 'Dupont',
        email: 'ancien@test.fr',
        firstHireDate: '2024-01-15',
        admin: false,
        password: null
      };

      collaboratorServiceSpy.updateCollaborator.mockReturnValue(of({}));

      component.collaboratorForm.setValue(collaborator);
      expect(component.collaboratorForm.status).toBe('VALID');
      component.updateCollaborator();

      expect(collaboratorServiceSpy.updateCollaborator).toHaveBeenCalledWith(
        '1',
        collaborator
      );
      
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/collaborators']);
    });

    it('should handle an error when updating a collaborator', () => {
      const error = new Error('Update failed');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
      
      collaboratorServiceSpy.updateCollaborator.mockReturnValue(
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

      component.updateCollaborator();

      expect(collaboratorServiceSpy.updateCollaborator).toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error updating collaborator:',
        error
      );

      consoleErrorSpy.mockRestore();
    });
  });
});