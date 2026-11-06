import { Component, signal } from '@angular/core';
import { FormField } from '../../../components/form-field/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssignmentService } from '../../../services/assignment/assignment-service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectOption } from '../../../models/select-option';
import { CollaboratorService } from '../../../services/collaborator/collaborator-service';
import { RestaurantService } from '../../../services/restaurant/restaurant-service';
import { JobService } from '../../../services/job/job-service';
import { endAfterStartDateValidator } from '../../../validators/end-after-start-date.validator';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [ReactiveFormsModule, FormField],
  selector: 'app-update-assignment',
  styleUrl: './update-assignment.css',
  templateUrl: './update-assignment.html',
})
export class UpdateAssignment {

  public id!: string | null;
  public assignmentForm!: FormGroup;
  private destroyRef = inject(DestroyRef);

  collaboratorOptions = signal<SelectOption[]>([]);
  restaurantOptions = signal<SelectOption[]>([]);
  jobOptions = signal<SelectOption[]>([]);

  constructor(
    private assignmentService: AssignmentService,
    private collaboratorService: CollaboratorService,
    private restaurantService: RestaurantService,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    this.assignmentForm = new FormGroup({
      collaborator: new FormControl<number | null>(null, Validators.required),
      restaurant: new FormControl<number | null>(null, Validators.required),
      job: new FormControl<number | null>(null, Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', [Validators.required, endAfterStartDateValidator('startDate')])
    });
    this.assignmentForm.get('startDate')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.assignmentForm.get('endDate')?.updateValueAndValidity();
      });

    this.getAssignmentById();
  }

  ngOnInit(): void {
    this.setCollaboratorOptions();
    this.setRestaurantOptions();
    this.setJobOptions();
  }

  public getAssignmentById() {
    this.assignmentService.getAssignmentById(this.id).subscribe({
      next: (assignment) => {
        this.setForm(assignment);
        console.log('Assignment ', this.id, ' fetched successfully:', assignment);
      },
      error: (error) => {
        console.error('Error fetching assignment:', error);
      }
    });
  }

  private setForm(assignment: any): void {
    this.assignmentForm.patchValue({
      collaborator: assignment.collaborator.id,
      restaurant: assignment.restaurant.id,
      job: assignment.job.id,
      startDate: assignment.startDate,
      endDate: assignment.endDate
    });
  }

  public updateAssignment() {
    if (this.assignmentForm.valid) {
      const formValue = this.assignmentForm.value;

      const assignmentRequest = {
        collaboratorId: formValue.collaborator,
        restaurantId: formValue.restaurant,
        jobId: formValue.job,
        startDate: formValue.startDate,
        endDate: formValue.endDate
      };

      this.assignmentService.updateAssignment(this.id, assignmentRequest).subscribe({
        next: (updatedAssignment) => {
          this.router.navigate(['/assignments']);
          console.log('Assignment updated successfully:', updatedAssignment);
        },
        error: (error) => {
          console.error('Error updating assignment:', error);
        }
      });
    } else {
      this.assignmentForm.markAllAsTouched();
    }
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
}