import { Component } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant/restaurant-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-create-restaurant',
  styleUrl: './create-restaurant.css',
  templateUrl: './create-restaurant.html',
})
export class CreateRestaurant {
  public restaurantForm: FormGroup;

  constructor(
    private restaurantService: RestaurantService,
    private router: Router
  ) {
    this.restaurantForm = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      postalCode: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
      city: new FormControl('', Validators.required)
    })
  }

  public createRestaurant() {
    if (this.restaurantForm.valid) {
      this.restaurantService.createRestaurant(this.restaurantForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/restaurants']);
          console.log('Restaurant created successfully:', response);
        }, error: (error) => {
          console.error('Error creating restaurant:', error);
        }
      });
    } else {
      this.restaurantForm.markAllAsTouched();
    }
  }
}