import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // si el campo está vacío, no validar
    }

    // const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);

    // const passwordValid = hasUpperCase && hasNumber;
    const passwordValid = hasNumber;

    return !passwordValid ? { passwordStrength: true } : null;
  };
}
