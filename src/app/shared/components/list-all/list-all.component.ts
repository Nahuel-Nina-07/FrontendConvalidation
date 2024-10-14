// In list-all.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { ModalOptionComponent } from '../modals/modal-option/modal-option.component';

@Component({
  selector: 'suint-list-all',
  standalone: true,
  imports: [CommonModule, SvgIconComponent,ModalOptionComponent],
  templateUrl: './list-all.component.html'
})
export class ListAllComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() text: string = 'Nuevo';
  @Input() iconSrc: string = 'assets/icons/icon-add.svg';

  @Output() deleteItem: EventEmitter<any> = new EventEmitter();
  @Output() editItem: EventEmitter<any> = new EventEmitter();

  public itemToDelete: any = null; // Ítem seleccionado para eliminar
  public isModalOpen: boolean = false; // Controla el estado del modal

  onEdit(item: any): void {
    this.editItem.emit(item);
  }

  onDelete(item: any): void {
    this.itemToDelete = item; // Guardar el ítem a eliminar
    this.isModalOpen = true;  // Abrir el modal
  }

  confirmDelete() {
    if (this.itemToDelete) {
      this.deleteItem.emit(this.itemToDelete); // Emitir la eliminación
      this.isModalOpen = false; // Cerrar el modal
      this.itemToDelete = null; // Limpiar la selección
    }
  }

  closeModal() {
    this.isModalOpen = false; // Cerrar el modal
  }

}
