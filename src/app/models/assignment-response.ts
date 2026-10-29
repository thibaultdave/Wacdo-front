export interface Assignment {
    id: number;
    collaboratorId: number;
    restaurantId: number;
    jobId: number;
    startDate: string;
    endDate: string | null;
}