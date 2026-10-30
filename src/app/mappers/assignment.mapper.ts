import { Assignment } from '../models/assignment';
import { AssignmentResponse } from '../models/assignment-response';
import { SummarizedObject } from '../models/summarized-object';
import { Collaborator} from '../models/collaborator-response';
import { Restaurant } from '../models/restaurant-response';

export function mapAssignment(response: AssignmentResponse): Assignment {
    return {
        ...response,
        collaborator: mapCollaborator(response.collaborator),
        restaurant: mapRestaurant(response.restaurant)
    };
}

export function mapCollaborator(
    collaborator: Collaborator
): SummarizedObject {
    return {
        id: collaborator.id,
        name: `${collaborator.firstName} ${collaborator.name}`
    };
}

export function mapRestaurant(
    restaurant: Restaurant
): SummarizedObject {
    return {
        id: restaurant.id,
        name: `${restaurant.name}, ${restaurant.city}`
    }
}