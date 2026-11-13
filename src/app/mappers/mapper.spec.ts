import { describe, expect, it } from 'vitest';
import { mapAssignment,mapCollaborator,mapRestaurant } from './assignment.mapper';
import { CollaboratorSummary } from '../models/collaborator-summary';
import { RestaurantSummary } from '../models/restaurant-summary';
import { Assignment } from '../models/assignment-response';

// MAP COLLABORATOR

describe('mapCollaborator', () => {
  it('should map a collaborator summary', () => {
    const collaborator = {
        id: 1,
        name: 'Dupont',
        firstName: 'Jean',
        email: 'jean.dupont@test.fr',
        firstHireDate: '2024-01-15',
        admin: false
    } as CollaboratorSummary;

    const result = mapCollaborator(collaborator);

    expect(result).toEqual({
        id: 1,
        name: 'Jean Dupont'
    });
  });
});

// MAP RESTAURANT

describe('mapRestaurant', () => {

  it('should map a restaurant summary', () => {
    const restaurant = {
        id: 2,
        name: 'Wacdo Vieux Port',
        address: '13 rue du Vieux Port',
        postalCode: '13000',
        city: 'Marseille'
    } as RestaurantSummary;

    const result = mapRestaurant(restaurant);

    expect(result).toEqual({
        id: 2,
        name: 'Wacdo Vieux Port, Marseille'
    });
  });
});

// MAP ASSIGNMENT

describe('mapAssignment', () => {
  it('should map an assignment response', () => {
    const assignment = {
      id: 3,
      startDate: '2026-01-01',
      endDate: null,
      collaborator: {
        id: 1,
        name: 'Dupont',
        firstName: 'Jean',
        email: 'jean.dupont@test.fr',
        firstHireDate: '2024-01-15',
        admin: false
      },
      restaurant: {
        id: 2,
        name: 'Wacdo Vieux Port',
        address: '13 rue du Vieux Port',
        postalCode: '13000',
        city: 'Marseille'
      },
      job: {
        id: 4,
        name: 'Manager'
      }
    } as Assignment;

    const result = mapAssignment(assignment);

    expect(result).toEqual({
      id: 3,
      startDate: '2026-01-01',
      endDate: null,
      collaborator: {
        id: 1,
        name: 'Jean Dupont'
      },
      restaurant: {
        id: 2,
        name: 'Wacdo Vieux Port, Marseille'
      },
      job: {
        id: 4,
        name: 'Manager'
      }
    });
  });
});