import { SummarizedObject } from "./summarized-object";

export interface Assignment {
    id: number;
    collaborator: SummarizedObject;
    restaurant: SummarizedObject;
    job: SummarizedObject;
    startDate: string;
    endDate: string | null;
}