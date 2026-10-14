import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function pastOrPresentDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // If the control is empty, we don't validate it here. The required validator should handle that.
    if (!value) {return null;}

    const selectedDate = new Date(`${value}T00:00:00`);
    const today = new Date();

    // Ignore hours, minutes, seconds, and milliseconds for comparison
    today.setHours(0, 0, 0, 0);

    return selectedDate <= today ? null : { futureDate: true };
  };
}