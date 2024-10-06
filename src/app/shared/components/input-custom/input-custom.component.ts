import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-custom',
  standalone: true,
  imports: [ ReactiveFormsModule,
    CommonModule ],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: InputCustomComponent,
        multi: true
      }
    ],
  templateUrl: './input-custom.component.html',
  styleUrl: './input-custom.component.scss'
})
export class InputCustomComponent implements ControlValueAccessor {
  @Input() placeholder: string = ''; // Placeholder del input
  @Input() type: string = 'text'; // Tipo de input (texto, email, etc.)
  @Input() value: string = ''; // Valor del input

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value); // Llamar a la función de cambio
  }
}