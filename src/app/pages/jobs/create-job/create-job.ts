import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobService } from '../../../services/job/job-service';
import { Router } from '@angular/router';
import { FormField } from '../../../components/form-field/form-field';

@Component({
  imports: [ReactiveFormsModule, FormField],
  selector: 'app-create-job',
  styleUrl: './create-job.css',
  templateUrl: './create-job.html',
})
export class CreateJob {
  public jobForm: FormGroup;

  constructor(
    private jobService: JobService,
    private router: Router
  ) {
    this.jobForm = new FormGroup({
      name: new FormControl('', Validators.required)
    })
  }

  public createJob() {
    if (this.jobForm.valid) {
      this.jobService.createJob(this.jobForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/jobs']);
          console.log('Job created successfully:', response);
        }, error: (error) => {
          console.error('Error creating job:', error);
        }
      });
    } else {
      this.jobForm.markAllAsTouched();
    }
  }
}