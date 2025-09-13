import { AbstractControl, ValidationErrors } from '@angular/forms';

export function phone11Validator(control: AbstractControl): ValidationErrors | null {
    const raw = (control.value ?? '').toString();
    const onlyDigits = raw.replace(/\D/g, '');
    return onlyDigits.length === 11 ? null : { phone11: true };
}
