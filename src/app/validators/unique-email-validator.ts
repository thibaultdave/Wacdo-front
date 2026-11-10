import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import { catchError, map, of } from 'rxjs';
import { CollaboratorService } from '../services/collaborator/collaborator-service';

export function uniqueEmailValidator(
  collaboratorService: CollaboratorService,
  currentEmail?: string
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (
      !control.value ||
      control.value.trim().toLowerCase() === currentEmail?.trim().toLowerCase()
    ) {
      return of(null);
    }

    return collaboratorService.emailExists(control.value).pipe(
      map(exists => exists ? { emailAlreadyExists: true } : null),
      catchError(() => of(null))
    );
  };
}