import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Collaborator } from './collaborator';
import { Collaborator as CollaboratorModel } from '../../models/collaborator-response';
import { CurrentCollaboratorService } from '../../services/collaborator/current-collaborator-service';
import { CollaboratorService } from '../../services/collaborator/collaborator-service';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';

function createCollaborator(
  overrides: Partial<CollaboratorModel> = {}
): CollaboratorModel {
  return {
    id: 1,
    name: 'Dupont',
    firstName: 'Jean',
    email: 'jean.dupont@test.fr',
    firstHireDate: '2024-01-15',
    admin: false,
    assignments: [],
    ...overrides
  };
}

describe('Collaborator', () => {
  let component: Collaborator;
  let fixture: ComponentFixture<Collaborator>;
  let collaboratorServiceSpy: {
    removeCollaborator: ReturnType<typeof vi.fn>;
  };
  let currentCollaboratorSignal: ReturnType<typeof signal>;

  beforeEach(async () => {
    collaboratorServiceSpy = {
      removeCollaborator: vi.fn()
    };

    currentCollaboratorSignal = signal<CollaboratorModel | null>(null);

    await TestBed.configureTestingModule({
      imports: [Collaborator],
      providers: [
        { provide: CollaboratorService, useValue: collaboratorServiceSpy },
        { provide: CurrentCollaboratorService, useValue: { currentCollaborator: currentCollaboratorSignal } },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Collaborator);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('collaborator', createCollaborator());
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // IS SAME USER

  describe('isSameUser', () => {

    it('should return true when collaborator is the current user', () => {
      const collaborator = createCollaborator();

      currentCollaboratorSignal.set(collaborator);
      fixture.componentRef.setInput('collaborator', collaborator);

      expect(component.isSameUser()).toBe(true);
    });

    it('should return false when collaborator is not the current user', () => {
      currentCollaboratorSignal.set(
        createCollaborator({ id: 2, email: 'other@test.fr' })
      );

      expect(component.isSameUser()).toBe(false);
    });

    it('should return false when there is no current user', () => {
      currentCollaboratorSignal.set(null);

      expect(component.isSameUser()).toBe(false);
    });
  });

  // CHANGE DATE FORMAT

  describe('changeDateFormat', () => {

    it('should format a date as DD/MM/YYYY', () => {
      expect(component.changeDateFormat('2024-01-15')).toBe('15/01/2024');
    });
  });

  // DELETE COLLABORATOR

  describe('deleteCollaborator', () => {

    it('should delete the collaborator and emit an event', () => {
      const emitSpy = vi.spyOn(component.collaboratorsUpdated, 'emit');
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      collaboratorServiceSpy.removeCollaborator.mockReturnValue(of(undefined));

      component.deleteCollaborator();

      expect(collaboratorServiceSpy.removeCollaborator).toHaveBeenCalledWith(1);
      expect(emitSpy).toHaveBeenCalledWith(true);

      consoleLogSpy.mockRestore();
    });

    it('should handle an error when deleting a collaborator', () => {
      const error = new Error('Server error');
      const emitSpy = vi.spyOn(component.collaboratorsUpdated, 'emit');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      collaboratorServiceSpy.removeCollaborator.mockReturnValue(
        throwError(() => error)
      );

      component.deleteCollaborator();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error deleting collaborator:',
        error
      );

      expect(emitSpy).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  // GET CURRENT ASSIGNMENT

  describe('getCurrentAssignment', () => {

    it('should return the current assignment', () => {
      const assignment = {
        startDate: '2025-01-15',
        endDate: null
      } as CollaboratorModel['assignments'][number];

      fixture.componentRef.setInput('collaborator', createCollaborator({
        assignments: [assignment]
      }));

      expect(component.getCurrentAssignment()).toBe(assignment);
    });

    it('should return null when there is no current assignment', () => {
      const assignment = {
        startDate: '2025-01-15',
        endDate: '2025-02-15'
      } as CollaboratorModel['assignments'][number];

      fixture.componentRef.setInput('collaborator', createCollaborator({
        assignments: [assignment]
      }));

      expect(component.getCurrentAssignment()).toBeNull();
    });

    it('should return the current assignment when several assignments exist', () => {
      const pastAssignment = {
        startDate: '2024-01-15',
        endDate: '2024-02-15'
      } as CollaboratorModel['assignments'][number];

      const currentAssignment = {
        startDate: '2025-01-15',
        endDate: null
      } as CollaboratorModel['assignments'][number];

      fixture.componentRef.setInput('collaborator', createCollaborator({
        assignments: [pastAssignment, currentAssignment]
      }));

      expect(component.getCurrentAssignment()).toBe(currentAssignment);
    });

    it('should return the current assignment when it starts today', () => {
      const today = new Date();
      const startDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0')
      ].join('-');

      const assignment = {
        startDate,
        endDate: null
      } as CollaboratorModel['assignments'][number];

      fixture.componentRef.setInput('collaborator', createCollaborator({
        assignments: [assignment]
      }));

      expect(component.getCurrentAssignment()).toBe(assignment);
    });

    it('should return null when assignment starts in the future', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const startDate = [
        tomorrow.getFullYear(),
        String(tomorrow.getMonth() + 1).padStart(2, '0'),
        String(tomorrow.getDate()).padStart(2, '0')
      ].join('-');

      const assignment = {
        startDate,
        endDate: null
      } as CollaboratorModel['assignments'][number];

      fixture.componentRef.setInput('collaborator', createCollaborator({
        assignments: [assignment]
      }));

      expect(component.getCurrentAssignment()).toBeNull();
    });
  });
});