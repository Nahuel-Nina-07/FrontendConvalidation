import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-option',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './modal-option.component.html',
})
export class ModalOptionComponent {
  @Input() itemName: string = ''; // Nombre del ítem a eliminar
  @Input() isOpen: boolean = false; // Controla si el modal está abierto o no

  @Output() confirmDelete: EventEmitter<void> = new EventEmitter();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  onConfirm() {
    this.confirmDelete.emit(); // Confirma la eliminación
    this.close(); // Cierra el modal
  }

  onCancel() {
    this.close(); // Solo cierra el modal
  }

  close() {
    this.isOpen = false;
    this.closeModal.emit(); // Emitir evento para cerrar el modal
  }
}
