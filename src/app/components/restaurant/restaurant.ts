import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RestaurantService } from '../../services/restaurant/restaurant-service';
import { Restaurant as RestaurantModel } from '../../models/restaurant-response';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-restaurant',
  styleUrl: './restaurant.css',
  templateUrl: './restaurant.html',
})
export class Restaurant {

  @Input() restaurant!: RestaurantModel;
  @Output() restaurantsUpdated = new EventEmitter<boolean>();

  constructor(private restaurantService: RestaurantService) { }

  public deleteRestaurant() {
    this.restaurantService.removeRestaurant(this.restaurant.id).subscribe({
      next: () => {
        this.restaurantsUpdated.emit(true);
        console.log(`Restaurant deleted: ${this.restaurant.name}`);
      },
      error: (error) => {
        console.error('Error deleting restaurant:', error);
      }
    });
  }
}
