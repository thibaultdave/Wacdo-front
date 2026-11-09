import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Collaborators } from './collaborators';
import { Collaborator as CollaboratorModel } from '../../models/collaborator-response';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { CollaboratorService } from '../../services/collaborator/collaborator-service';

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

describe('Collaborators', () => {
  let component: Collaborators;
  let fixture: ComponentFixture<Collaborators>;
  let collaboratorServiceSpy: {
    getCollaborators: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    collaboratorServiceSpy = {
      getCollaborators: vi.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [Collaborators],
      providers: [
        { provide: CollaboratorService, useValue: collaboratorServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Collaborators);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // REFRESH COLLABORATORS

  it('should retrieve collaborators on initialization', () => {
    const collaborators: CollaboratorModel[] = [
      createCollaborator()
    ];

    collaboratorServiceSpy.getCollaborators.mockReturnValue(of(collaborators));

    fixture.detectChanges();

    expect(collaboratorServiceSpy.getCollaborators).toHaveBeenCalledOnce();
    expect(component.collaborators()).toEqual(collaborators);
  });

  // FILTERS

  describe('Collaborators filters', () => {

    beforeEach(() => {
      component.collaborators.set([
        createCollaborator(),
        createCollaborator({
          id: 2,
          name: 'Martin',
          firstName: 'Paul',
          email: 'paul.martin@test.fr'
        }),
        createCollaborator({
          id: 3,
          name: 'Durand',
          firstName: 'Marie',
          email: 'marie.durand@test.fr'
        })
      ]);
    });

    // Test filtering by name, first name, and email

    it('should filter collaborators by name', () => {
      component.nameFilter.set('Martin');

      expect(component.filteredCollaborators()).toHaveLength(1);
      expect(component.filteredCollaborators()[0].id).toBe(2);
    });

    it('should filter collaborators by first name', () => {
      component.firstNameFilter.set('Marie');

      expect(component.filteredCollaborators()).toHaveLength(1);
      expect(component.filteredCollaborators()[0].id).toBe(3);
    });

    it('should filter collaborators by email', () => {
      component.emailFilter.set('jean.dupont');

      expect(component.filteredCollaborators()).toHaveLength(1);
      expect(component.filteredCollaborators()[0].id).toBe(1);
    });

    it('should return all collaborators when filters are empty', () => {
      expect(component.filteredCollaborators()).toHaveLength(3);
    });

    it('should return an empty array when no collaborator matches', () => {
      component.nameFilter.set('Inconnu');

      expect(component.filteredCollaborators()).toHaveLength(0);
    });

    // Test computed list behavior and reactivity

    it('should update filtered collaborators when filters change', () => {
      expect(component.filteredCollaborators()).toHaveLength(3);

      component.nameFilter.set('Martin');

      expect(component.filteredCollaborators()).toHaveLength(1);
      expect(component.filteredCollaborators()[0].name).toBe('Martin');
    });

    it('should not modify the original collaborators list when filtering', () => {
      component.nameFilter.set('Martin');

      expect(component.filteredCollaborators()).toHaveLength(1);
      expect(component.collaborators()).toHaveLength(3);
    });

    // Test case sensitivity and whitespace handling

    it('should ignore uppercase and lowercase differences', () => {
      component.nameFilter.set('DUPONT');

      expect(component.filteredCollaborators()).toHaveLength(1);
    });

    it('should ignore leading and trailing spaces', () => {
      component.nameFilter.set('  Dupont  ');

      expect(component.filteredCollaborators()).toHaveLength(1);
    });

    it('should combine multiple filters', () => {
      component.nameFilter.set('Dupont');
      component.firstNameFilter.set('Jean');
      component.emailFilter.set('jean.dupont@test.fr');

      expect(component.filteredCollaborators()).toHaveLength(1);
      expect(component.filteredCollaborators()[0].id).toBe(1);
    });
  });
});