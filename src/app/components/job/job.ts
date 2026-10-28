import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Job as JobModel } from '../../models/job-response';
import { JobService } from '../../services/job/job-service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-job',
  styleUrl: './job.css',
  templateUrl: './job.html',
})
export class Job {

  @Input() job!: JobModel;
  @Output() jobsUpdated = new EventEmitter<boolean>();

  constructor(private jobService: JobService) { }
  
  public deleteJob() {
    this.jobService.removeJob(this.job.id).subscribe({
      next: () => {
        this.jobsUpdated.emit(true);
        console.log(`Job deleted: ${this.job.name}`);
      },
      error: (error) => {
        console.error('Error deleting job:', error);
      }
    });
  }
}
