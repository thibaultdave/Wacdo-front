import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurant as RestaurantModel } from '../../../models/restaurant-response';
import { RestaurantService } from '../../../services/restaurant/restaurant-service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-update-restaurant',
  styleUrl: './update-restaurant.css',
  templateUrl: './update-restaurant.html',
})
export class UpdateRestaurant {

  public id!: string | null;
  public restaurantForm!: FormGroup;

  constructor(
    private restaurantService: RestaurantService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    this.restaurantForm = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      postalCode: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
      city: new FormControl('', Validators.required)
    })

    this.getRestaurantById();
  }

  public getRestaurantById() {
    this.restaurantService.getRestaurantById(this.id).subscribe({
      next: (restaurant) => {
        this.setForm(restaurant);
        console.log('Restaurant ', this.id, ' fetched successfully:', restaurant);
      },
      error: (error) => {
        console.error('Error fetching restaurant:', error);
      }
    })
  }

  private setForm(restaurant: RestaurantModel): void {
    this.restaurantForm.patchValue({
      name: restaurant.name,
      address: restaurant.address,
      postalCode: restaurant.postalCode,
      city: restaurant.city,
    });
}
  
  public updateRestaurant() {
    if (this.restaurantForm.valid) {
      this.restaurantService.updateRestaurant(
        this.id,
        this.restaurantForm.value
      ).subscribe({
        next: (response) => {
          this.router.navigate(['/restaurants']);
          console.log('Restaurant updated successfully:', response);
        }, error: (error) => {
          console.error('Error updating restaurant:', error);
        }
      });
    } else {
      this.restaurantForm.markAllAsTouched();
    }
  }
}