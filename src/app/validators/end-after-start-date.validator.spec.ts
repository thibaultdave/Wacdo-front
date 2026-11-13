import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { endAfterStartDateValidator } from './end-after-start-date.validator';

function createForm(startDate: string, endDate: string) {
    const startDateControl = new FormControl(startDate);
    const endDateControl = new FormControl(endDate);

    const form = new FormGroup({
        startDate: startDateControl,
        endDate: endDateControl
    });

    endDateControl.addValidators(
        endAfterStartDateValidator('startDate')
    );

    endDateControl.updateValueAndValidity();

    return form;
}

describe('endAfterStartDateValidator', () => {
    
    it('should accept an end date after the start date', () => {
        const form = createForm('2026-01-01', '2026-01-02');

        expect(form.get('endDate')?.errors).toBeNull();
    });

    it('should reject an end date before the start date', () => {
        const form = createForm('2026-01-02', '2026-01-01');

        expect(form.get('endDate')?.errors).toEqual({
        endDateNotAfterStartDate: true
        });
    });

    it('should reject an end date equal to the start date', () => {
        const form = createForm('2026-01-01', '2026-01-01');

        expect(form.get('endDate')?.errors).toEqual({
        endDateNotAfterStartDate: true
        });
    });

    it('should accept an empty end date', () => {
        const form = createForm('2026-01-01', '');

        expect(form.get('endDate')?.errors).toBeNull();
    });

    it('should accept an empty start date', () => {
        const form = createForm('', '2026-01-02');

        expect(form.get('endDate')?.errors).toBeNull();
    });
});