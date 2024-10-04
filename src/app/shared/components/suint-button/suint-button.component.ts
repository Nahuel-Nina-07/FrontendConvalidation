import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-suint-button',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './suint-button.component.html'
})
export class SuintButtonComponent {
  @Input() text: string = 'Nuevo';  // Texto por defecto
  @Input() iconSrc: string = 'assets/icons/icon-add.svg';  // Dirección del ícono por defecto

  @Output() onClickButton = new EventEmitter<void>();

  clickButton(){
    this.onClickButton.emit();
  }
}
