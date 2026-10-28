import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobService } from '../../../services/job/job-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Job as JobModel } from '../../../models/job-response';
import { FormField } from '../../../components/form-field/form-field';

@Component({
  imports: [ReactiveFormsModule, FormField],
  selector: 'app-update-job',
  styleUrl: './update-job.css',
  templateUrl: './update-job.html',
})
export class UpdateJob {

  public id!: string | null;
  public jobForm!: FormGroup;

  constructor(
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    this.jobForm = new FormGroup({
      name: new FormControl('', Validators.required)
    })

    this.getJobById();
  }

  public getJobById() {
    this.jobService.getJobById(this.id).subscribe({
      next: (job) => {
        this.setForm(job);
        console.log('Job ', this.id, ' fetched successfully:', job);
      },
      error: (error) => {
        console.error('Error fetching job:', error);
      }
    })
  }

  private setForm(job: JobModel): void {
    this.jobForm.patchValue({
      name: job.name
    });
  }

  public updateJob() {
    if (this.jobForm.valid) {
      this.jobService.updateJob(
        this.id,
        this.jobForm.value
      ).subscribe({
        next: (response) => {
          this.router.navigate(['/jobs']);
          console.log('Job updated successfully:', response);
        }, error: (error) => {
          console.error('Error updating job:', error);
        }
      });
    } else {
      this.jobForm.markAllAsTouched();
    }
  }
}
