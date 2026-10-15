import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Collaborator as CollaboratorModel } from '../../models/collaborator-response';
import { CollaboratorService } from '../../services/collaborator-service';
import { pastOrPresentDateValidator } from '../../validators/past-or-present-date.validator';
import { Subscription } from 'rxjs';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-update-collaborator',
  styleUrl: './update-collaborator.css',
  templateUrl: './update-collaborator.html',
})
export class UpdateCollaborator {

  private collaborator!: CollaboratorModel;
  private routeSub!: Subscription;

  public collaboratorForm!: FormGroup;

  constructor(
    private collaboratorService: CollaboratorService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.collaboratorForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      firstHireDate: new FormControl('', [Validators.required, pastOrPresentDateValidator()]),
      admin: new FormControl(false),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
    // TODO handle update without password change, maybe with a checkbox to enable password change
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      const collaboratorId = +params['id'];
      this.getCollaboratorById(collaboratorId);
    });
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  private setForm(): void {
    this.collaboratorForm.patchValue({
      firstName: this.collaborator.firstName,
      name: this.collaborator.name,
      email: this.collaborator.email,
      firstHireDate: this.collaborator.firstHireDate,
      admin: this.collaborator.admin,
    });
  }

  public getCollaboratorById(id: number) {
    this.collaboratorService.getCollaboratorById(id).subscribe({
      next: (collaborator) => {
        this.collaborator = collaborator;
        this.setForm();
        console.log('Collaborator ', id, ' fetched successfully:', collaborator);
      },
      error: (error) => {
        console.error('Error fetching collaborator:', error);
      }
    });
  }

  public updateCollaborator() {
    if (this.collaboratorForm.valid) {
      this.collaboratorService.updateCollaborator(
        this.collaborator.id,
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