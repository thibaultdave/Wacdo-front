import { Component, signal, computed } from '@angular/core';
import { RestaurantService } from '../../services/restaurant/restaurant-service';
import { Restaurant as RestaurantModel } from '../../models/restaurant-response';
import { Restaurant as RestaurantComponent } from '../../components/restaurant/restaurant';
import { RouterLink } from '@angular/router';
import { Filter } from '../../components/filter/filter';

@Component({
  imports: [RestaurantComponent, RouterLink, Filter],
  selector: 'app-restaurants',
  styleUrl: './restaurants.css',
  templateUrl: './restaurants.html',
})
export class Restaurants {

  restaurants = signal<RestaurantModel[]>([]);

  nameFilter = signal('');
  addressFilter = signal('');
  postalCodeFilter = signal('');
  cityFilter = signal('');

  filteredRestaurants = computed(() => {
    const name = this.nameFilter().trim().toLocaleLowerCase('fr-FR');
    const address = this.addressFilter().trim().toLocaleLowerCase('fr-FR');
    const postalCode = this.postalCodeFilter().trim();
    const city = this.cityFilter().trim().toLocaleLowerCase('fr-FR');

    return this.restaurants().filter(restaurant =>
      restaurant.name.toLocaleLowerCase('fr-FR').includes(name) &&
      restaurant.address.toLocaleLowerCase('fr-FR').includes(address) &&
      restaurant.postalCode.includes(postalCode) &&
      restaurant.city.toLocaleLowerCase('fr-FR').includes(city)
    );
  });

  constructor(private restaurantService: RestaurantService) { }

  ngOnInit(): void {
    this.refreshRestaurants();
  }
  
  public refreshRestaurants() {
    this.restaurantService.getRestaurants().subscribe({
      next: (restaurants) => {
        console.log('Restaurants retrieved :', restaurants);
        this.restaurants.set(restaurants);
      },
      error: (error) => {
        console.error('Error retrieving restaurants :', error);
      }
    });
  }
}