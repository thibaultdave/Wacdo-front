import { FormControl, FormGroup, Validators } from '@angular/forms';
import { describe, expect, it, vi } from 'vitest';
import { pastOrPresentDateValidator } from './past-or-present-date.validator';
import { CollaboratorService } from '../services/collaborator/collaborator-service';
import { of, throwError } from 'rxjs';

describe('pastOrPresentDateValidator', () => {
  const validator = pastOrPresentDateValidator();

  it('should accept a past date', () => {
    const control = new FormControl('2000-01-01');

    expect(validator(control)).toBeNull();
  });

  it('should accept today', () => {
    const today = new Date();
    const date = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');

    const control = new FormControl(date);

    expect(validator(control)).toBeNull();
  });

  it('should reject a future date', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const date = [
      tomorrow.getFullYear(),
      String(tomorrow.getMonth() + 1).padStart(2, '0'),
      String(tomorrow.getDate()).padStart(2, '0')
    ].join('-');

    const control = new FormControl(date);

    expect(validator(control)).toEqual({ futureDate: true });
  });

  it('should accept an empty value', () => {
    const control = new FormControl('');

    expect(validator(control)).toBeNull();
  });
});