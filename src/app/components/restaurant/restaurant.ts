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

  public showAssignments = false;

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

  public toggleAssignments() {
    this.showAssignments = !this.showAssignments;
  }

  public getCurrentAssignments() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.restaurant.assignments.filter((assignment) => {
      const startDate = new Date(`${assignment.startDate}T00:00:00`);
      const endDate = new Date(`${assignment.endDate}T00:00:00`);

      return startDate <= today &&
        (
          assignment.endDate === null ||
          endDate >= today
        )
    });
  }

  public changeDateFormat(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}