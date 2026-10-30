import { Collaborator } from "./collaborator-response";
import { Job } from "./job-response";
import { Restaurant } from "./restaurant-response";

export interface AssignmentResponse {
    id: number;
    collaborator: Collaborator;
    restaurant: Restaurant;
    job: Job;
    startDate: string;
    endDate: string | null;
}