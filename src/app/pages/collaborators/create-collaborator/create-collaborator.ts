import { Component } from '@angular/core';
import { CollaboratorService } from '../../../services/collaborator/collaborator-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { pastOrPresentDateValidator } from '../../../validators/past-or-present-date.validator';
import { FormField } from '../../../components/form-field/form-field';

@Component({
  imports: [ReactiveFormsModule, FormField],
  selector: 'app-create-collaborator',
  styleUrl: './create-collaborator.css',
  templateUrl: './create-collaborator.html',
})
export class CreateCollaborator {
  public collaboratorForm: FormGroup;

  constructor(
    private collaboratorService: CollaboratorService,
    private router: Router
  ) {
    this.collaboratorForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      firstHireDate: new FormControl('', [Validators.required, pastOrPresentDateValidator()]),
      admin: new FormControl(false),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  public createCollaborator() {
    if (this.collaboratorForm.valid) {
      this.collaboratorService.createCollaborator(this.collaboratorForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/collaborators']);
          console.log('Collaborator created successfully:', response);
        }, error: (error) => {
          console.error('Error creating collaborator:', error);
        }
      });
    } else {
      this.collaboratorForm.markAllAsTouched();
    }
  }
}