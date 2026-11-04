import { AssignmentSummary } from '../models/assignment-summary';
import { Assignment as AssignmentResponse } from '../models/assignment-response';
import { SummarizedObject } from '../models/summarized-object';
import { CollaboratorSummary } from '../models/collaborator-summary';
import { RestaurantSummary } from '../models/restaurant-summary';

export function mapAssignment(response: AssignmentResponse): AssignmentSummary {
    return {
        ...response,
        collaborator: mapCollaborator(response.collaborator),
        restaurant: mapRestaurant(response.restaurant)
    };
}

export function mapCollaborator(
    collaborator: CollaboratorSummary
): SummarizedObject {
    return {
        id: collaborator.id,
        name: `${collaborator.firstName} ${collaborator.name}`
    };
}

export function mapRestaurant(
    restaurant: RestaurantSummary
): SummarizedObject {
    return {
        id: restaurant.id,
        name: `${restaurant.name}, ${restaurant.city}`
    }
}