import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssignmentService } from '../../../services/assignment/assignment-service';
import { Router } from '@angular/router';
import { pastOrPresentDateValidator } from '../../../validators/past-or-present-date.validator';
import { FormField } from '../../../components/form-field/form-field';
import { JobService } from '../../../services/job/job-service';
import { RestaurantService } from '../../../services/restaurant/restaurant-service';
import { CollaboratorService } from '../../../services/collaborator/collaborator-service';
import { SelectOption } from '../../../models/select-option';

@Component({
  imports: [ReactiveFormsModule, FormField],
  selector: 'app-create-assignment',
  styleUrl: './create-assignment.css',
  templateUrl: './create-assignment.html',
})
export class CreateAssignment {
  public assignmentForm: FormGroup;

  collaboratorOptions = signal<SelectOption[]>([]);
  restaurantOptions = signal<SelectOption[]>([]);
  jobOptions = signal<SelectOption[]>([]);

  constructor(
    private assignmentService: AssignmentService,
    private collaboratorService: CollaboratorService,
    private restaurantService: RestaurantService,
    private jobService: JobService,
    private router: Router
  ) {
    this.assignmentForm = new FormGroup({
      collaborator: new FormControl<number | null>(null, Validators.required),
      restaurant: new FormControl<number | null>(null, Validators.required),
      job: new FormControl<number | null>(null, Validators.required),
      startDate: new FormControl('', [Validators.required, pastOrPresentDateValidator()]),
      endDate: new FormControl('', pastOrPresentDateValidator())
    })
  }

  ngOnInit(): void {
    this.setCollaboratorOptions();
    this.setRestaurantOptions();
    this.setJobOptions();
  }

  setCollaboratorOptions() {
    this.collaboratorService.getCollaborators().subscribe({
      next: (collaborators) => {
        this.collaboratorOptions.set(
          collaborators.map(collaborator => ({
            label: `${collaborator.firstName} ${collaborator.name}`,
            value: collaborator.id
          }))
        );
      },
      error: (error) => {
        console.error('Error retrieving collaborators:', error);
      }
    });
  }

  setRestaurantOptions() {
    this.restaurantService.getRestaurants().subscribe({
      next: (restaurants) => {
        this.restaurantOptions.set(
          restaurants.map(restaurant => ({
            label: restaurant.name,
            value: restaurant.id
          }))
        );
      },
      error: (error) => {
        console.error('Error retrieving restaurants:', error);
      }
    });
  }

  setJobOptions() {
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.jobOptions.set(
          jobs.map(job => ({
            label: job.name,
            value: job.id
          }))
        );
      },
      error: (error) => {
        console.error('Error retrieving jobs:', error);
      }
    });
  }

  public createAssignment() {
    if (this.assignmentForm.valid) {
      const formValue = this.assignmentForm.value;

      const assignmentRequest = {
        collaboratorId: formValue.collaborator,
        restaurantId: formValue.restaurant,
        jobId: formValue.job,
        startDate: formValue.startDate,
        endDate: formValue.endDate || null
      };

      this.assignmentService.createAssignment(assignmentRequest).subscribe({
        next: (response) => {
          this.router.navigate(['/assignments']);
          console.log('Assignment created successfully:', response);
        }, error: (error) => {
          console.error('Error creating assignment:', error);
        }
      });
    } else {
      this.assignmentForm.markAllAsTouched();
    }
  }
}