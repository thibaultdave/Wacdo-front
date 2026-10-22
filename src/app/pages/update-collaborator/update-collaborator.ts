import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Collaborator as CollaboratorModel } from '../../models/collaborator-response';
import { CollaboratorService } from '../../services/collaborator/collaborator-service';
import { pastOrPresentDateValidator } from '../../validators/past-or-present-date.validator';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-update-collaborator',
  styleUrl: './update-collaborator.css',
  templateUrl: './update-collaborator.html',
})
export class UpdateCollaborator {

  public id!: string | null;
  public collaboratorForm!: FormGroup;

  constructor(
    private collaboratorService: CollaboratorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    this.collaboratorForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      firstHireDate: new FormControl('', [Validators.required, pastOrPresentDateValidator()]),
      admin: new FormControl(false),
      password: new FormControl(null, [Validators.minLength(8)]),
    });

    this.getCollaboratorById();
  }

  public getCollaboratorById() {
    this.collaboratorService.getCollaboratorById(this.id).subscribe({
      next: (collaborator) => {
        this.setForm(collaborator);
        console.log('Collaborator ', this.id, ' fetched successfully:', collaborator);
      },
      error: (error) => {
        console.error('Error fetching collaborator:', error);
      }
    });
  }

  private setForm(collaborator: CollaboratorModel): void {
    this.collaboratorForm.patchValue({
      firstName: collaborator.firstName,
      name: collaborator.name,
      email: collaborator.email,
      firstHireDate: collaborator.firstHireDate,
      admin: collaborator.admin,
    });
  }

  public updateCollaborator() {
    if (this.collaboratorForm.valid) {
      this.collaboratorService.updateCollaborator(
        this.id,
        this.collaboratorForm.value
      ).subscribe({
        next: (response) => {
          this.router.navigate(['/collaborators']);
          console.log('Collaborator updated successfully:', response);
        }, error: (error) => {
          console.error('Error updating collaborator:', error);
        }
      });
    } else {
      this.collaboratorForm.markAllAsTouched();
    }
  }
}