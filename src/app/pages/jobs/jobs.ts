import { Component, signal, computed } from '@angular/core';
import { Job as JobModel } from '../../models/job-response';
import { JobService } from '../../services/job/job-service';
import { RouterLink } from '@angular/router';
import { Filter } from '../../components/filter/filter';
import { Job as JobComponent } from '../../components/job/job';

@Component({
  imports: [JobComponent, RouterLink, Filter],
  selector: 'app-jobs',
  styleUrl: './jobs.css',
  templateUrl: './jobs.html',
})
export class Jobs {

  jobs = signal<JobModel[]>([]);

  nameFilter = signal('');

  filteredJobs = computed(() => {
    const name = this.nameFilter().trim().toLocaleLowerCase('fr-FR');

    return this.jobs().filter(job =>
      job.name.toLocaleLowerCase('fr-FR').includes(name)
    );
  });
  
  constructor(private jobService: JobService) { }

  ngOnInit(): void {
    this.refreshJobs();
  }

  public refreshJobs() {
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        console.log('Jobs retrieved :', jobs);
        this.jobs.set(jobs);
      },
      error: (error) => {
        console.error('Error retrieving jobs :', error);
      }
    });
  }
}