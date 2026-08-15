import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function requiredNotBlankValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return typeof value === 'string' && value.trim().length === 0
      ? { required: true }
      : null;
  };
}
