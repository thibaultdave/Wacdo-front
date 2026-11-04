import { CollaboratorSummary } from "./collaborator-summary";
import { Job } from "./job-response";
import { RestaurantSummary } from "./restaurant-summary";

export interface Assignment {
    id: number;
    collaborator: CollaboratorSummary;
    restaurant: RestaurantSummary;
    job: Job;
    startDate: string;
    endDate: string | null;
}