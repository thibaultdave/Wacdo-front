import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function endAfterStartDateValidator(startDateControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const endDateValue = control.value;
        const startDateValue = control.parent?.get(startDateControlName)?.value;
      
        // If one of the controls is empty, we don't validate it here. The required validator should handle that.
        if (!endDateValue || !startDateValue) { return null; }

        const endDate = new Date(`${endDateValue}T00:00:00`);
        const startDate = new Date(`${startDateValue}T00:00:00`);

        return endDate > startDate ? null : { endDateNotAfterStartDate: true };
    };
}