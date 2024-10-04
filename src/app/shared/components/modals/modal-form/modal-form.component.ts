import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'suit-modal-form',
  standalone: true,
  imports: [SvgIconComponent,CommonModule],
  templateUrl: './modal-form.component.html',
  styleUrl: './modal-form.component.scss'
})
export class ModalFormComponent {
  @Input() titleModal: string = '';  
  @Input() width: string = '600px';      
  @Input() minHeight: string = 'auto';   
  @Input() maxWidth: string = '90%';     
  
  public isOpen = false;

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    window.location.reload();
    this.isOpen = false;
  }
}
