import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function phoneFaxValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
  
      // Si no se ingresa un valor
      if (!value) {
        return null;
      }
  
      // Verificar si el valor es un número
      if (!/^\d+$/.test(value)) {
        return { invalidNumber: true }; // Invalid number if not all digits
      }
  
      // Validación de números de teléfono y fax
      const firstDigit = value[0];
  
      // Validación para teléfono y fax (empieza con 6 o 7 y tiene 8 dígitos)
      if ((firstDigit === '6' || firstDigit === '7') && value.length === 8) {
        return null; // Válido si empieza con 6 o 7 y tiene 8 dígitos
      }
  
      // Validación para teléfono (empieza con 4 y tiene 9 dígitos)
      if (firstDigit === '4' && value.length === 9) {
        return null; // Válido si empieza con 4 y tiene 9 dígitos
      }
  
      // Si no se cumple ninguna de las condiciones anteriores
      return { invalidLength: true };
    };
  }