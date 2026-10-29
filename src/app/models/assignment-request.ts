export interface RestaurantRequest {
    collaboratorId: number;
    restaurantId: number;
    jobId: number;
    startDate: string;
    endDate: string | null;
}