import { Component, computed, signal } from '@angular/core';
import { Assignment as AssignmentModel } from '../../models/assignment'
import { Assignment as AssignmentCompoment } from '../../components/assignment/assignment';
import { AssignmentService } from '../../services/assignment/assignment-service'
import { RouterLink } from '@angular/router';
import { Filter } from '../../components/filter/filter';

@Component({
  imports: [AssignmentCompoment, RouterLink, Filter],
  selector: 'app-assignments',
  styleUrl: './assignments.css',
  templateUrl: './assignments.html',
})
export class Assignments {

  assignments = signal<AssignmentModel[]>([]);

  collaboratorFilter = signal('');
  restaurantFilter = signal('');
  jobFilter = signal('');

  filteredAssignments = computed(() => {
    const collaborator = this.collaboratorFilter().trim().toLocaleLowerCase('fr-FR');
    const restaurant = this.restaurantFilter().trim().toLocaleLowerCase('fr-FR');
    const job = this.jobFilter().trim().toLocaleLowerCase('fr-FR');

    return this.assignments().filter(assignment =>
      assignment.collaborator.name.toLocaleLowerCase('fr-FR').includes(collaborator) &&
      assignment.restaurant.name.toLocaleLowerCase('fr-FR').includes(restaurant) &&
      assignment.job.name.toLocaleLowerCase('fr-FR').includes(job)
    );
  });

  constructor(private assignmentService: AssignmentService) { }

  ngOnInit(): void {
    this.refreshAssignments();
  }

  public refreshAssignments() {
    this.assignmentService.getAssignments().subscribe({
      next: (assignments) => {
        console.log('Assignments retrieved :', assignments);
        this.assignments.set(assignments);
      },
      error: (error) => {
        console.error('Error retrieving assignments :', error);
      }
    });
  }
}