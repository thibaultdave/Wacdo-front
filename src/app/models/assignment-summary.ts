import { SummarizedObject } from "./summarized-object";

export interface AssignmentSummary {
    id: number;
    collaborator: SummarizedObject;
    restaurant: SummarizedObject;
    job: SummarizedObject;
    startDate: string;
    endDate: string | null;
}