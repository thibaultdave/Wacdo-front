import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Assignment as AssignmentModel } from '../../models/assignment';
import { RouterLink } from '@angular/router';
import { AssignmentService } from '../../services/assignment/assignment-service';

@Component({
  imports: [RouterLink],
  selector: 'app-assignment',
  styleUrl: './assignment.css',
  templateUrl: './assignment.html',
})
export class Assignment {

  @Input() assignment!: AssignmentModel;
  @Output() assignmentsUpdated = new EventEmitter<boolean>();

  public changeDateFormat(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  constructor(private assignmentService: AssignmentService) { }
  
  public deleteAssignment() {
    this.assignmentService.removeAssignment(this.assignment.id).subscribe({
      next: () => {
        this.assignmentsUpdated.emit(true);
        console.log(`Assignment deleted: ${this.assignment.id}`);
      },
      error: (error) => {
        console.error('Error deleting assignment:', error);
      }
    });
  }
}