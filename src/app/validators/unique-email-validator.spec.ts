import { FormControl, ValidationErrors } from '@angular/forms';
import { describe, expect, it, vi } from 'vitest';
import { uniqueEmailValidator } from './unique-email-validator';
import { CollaboratorService } from '../services/collaborator/collaborator-service';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';

describe('uniqueEmailValidator', () => {
  const email = 'jean.dupont@test.fr';

  let collaboratorServiceSpy: {
    emailExists: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    collaboratorServiceSpy = {
      emailExists: vi.fn()
    };
  });

    it('should return null when email is available', async () => {
        collaboratorServiceSpy.emailExists.mockReturnValue(of(false));

        const validator = uniqueEmailValidator(
            collaboratorServiceSpy as unknown as CollaboratorService
        );
        const control = new FormControl(email);

        const result = await firstValueFrom(
            validator(control) as Observable<ValidationErrors | null>
        );

        expect(result).toBeNull();
        expect(collaboratorServiceSpy.emailExists).toHaveBeenCalledWith(email);
    });

    it('should return an error when email already exists', async () => {
        collaboratorServiceSpy.emailExists.mockReturnValue(of(true));

        const validator = uniqueEmailValidator(collaboratorServiceSpy as unknown as CollaboratorService);
        const control = new FormControl(email);

        const result = await firstValueFrom(
            validator(control) as Observable<ValidationErrors | null>
        );

        expect(result).toEqual(
            { emailAlreadyExists: true }
        );
    });

    it('should not call the service when email is unchanged', async () => {
        const validator = uniqueEmailValidator(
            collaboratorServiceSpy as unknown as CollaboratorService,
        'Jean.Dupont@Test.fr'
        );

        const control = new FormControl('jean.dupont@test.fr');

        const result = await firstValueFrom(
            validator(control) as Observable<ValidationErrors | null>
        );

        expect(result).toBeNull();
        expect(collaboratorServiceSpy.emailExists).not.toHaveBeenCalled();
    });

    it('should not call the service when email is empty', async () => {
        const validator = uniqueEmailValidator(collaboratorServiceSpy as unknown as CollaboratorService);
        const control = new FormControl('');

        const result = await firstValueFrom(
            validator(control) as Observable<ValidationErrors | null>
        );

        expect(result).toBeNull();
        expect(collaboratorServiceSpy.emailExists).not.toHaveBeenCalled();
    });

    it('should return null when the service throws an error', async () => {
        collaboratorServiceSpy.emailExists.mockReturnValue(
            throwError(() => new Error('Server error'))
        );

        const validator = uniqueEmailValidator(collaboratorServiceSpy as unknown as CollaboratorService);
        const control = new FormControl(email);

        const result = await firstValueFrom(
            validator(control) as Observable<ValidationErrors | null>
        );
        
        expect(result).toBeNull();
    });
});