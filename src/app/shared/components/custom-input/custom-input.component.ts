import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputDirective } from '../../directives/input.directive';

@Component({
  selector: 'input-custom',
  standalone: true,
  imports: [InputDirective, CommonModule, FormsModule],
  templateUrl: './custom-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCustomComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputCustomComponent implements ControlValueAccessor {
  @Input() name: string = ''; 
  @Input() type: string = 'text'; 
  @Input() placeholder: string = ''; 
  @Input() inputWidth: string = 'w-full'; 
  @Input() minHeight: string = 'auto';   
  @Input() maxWidth: string = 'w-full';     

  @Input() options: any[] = []; // Arreglo de objetos
  @Input() displayProperty: string = 'name'; // Propiedad a mostrar en el select
  @Input() valueProperty: string = 'id'; // Propiedad a enviar como valor

  value: any = null; // Cambiar a null inicialmente
  isDisabled: boolean = false;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.onTouched();
  }

  onSelectChange(event: any) {
    const selectedValue = event; // Ya es el valor del select

    // Buscar el option que coincide con el valor seleccionado
    const selectedOption = this.options.find(option => option[this.valueProperty] === selectedValue);

    // Si se encuentra, asigna el valor correspondiente, si no, asigna null
    this.value = selectedOption ? selectedOption[this.valueProperty] : null;

    this.onChange(this.value); // Notificar el cambio
    this.onTouched(); // Marcar como tocado
}


}
