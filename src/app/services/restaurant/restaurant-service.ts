import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Restaurant as RestaurantResponse } from '../../models/restaurant-response';
import { RestaurantRequest } from '../../models/restaurant-request';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

    private readonly apiUrl = `${environment.apiUrl}/api/restaurants`;

    constructor(private http: HttpClient) { }
    
    getRestaurants(): Observable<RestaurantResponse[]> {
        return this.http.get<RestaurantResponse[]>(`${this.apiUrl}`);
    }

    getRestaurantById(id: string | null): Observable<RestaurantResponse> {
        return this.http.get<RestaurantResponse>(`${this.apiUrl}/${id}`);
      }
    
      removeRestaurant(id: number): Observable<void> { 
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
      }
    
      createRestaurant(restaurantRequest: RestaurantRequest): Observable<RestaurantResponse> {
        return this.http.post<RestaurantResponse>(`${this.apiUrl}`, restaurantRequest);
      }
    
      updateRestaurant(id: string | null, restaurantRequest: RestaurantRequest): Observable<RestaurantResponse> {
        return this.http.put<RestaurantResponse>(`${this.apiUrl}/${id}`, restaurantRequest);
      }
}
