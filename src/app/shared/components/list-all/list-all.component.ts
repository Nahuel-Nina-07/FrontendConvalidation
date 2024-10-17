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

  // Configuración de botones personalizados que se pueden agregar dinámicamente
  @Input() additionalColumns: any[] = [];

  public itemToDelete: any = null;
  public isModalOpen: boolean = false;

  ngOnInit() {
    // Puedes inicializar cualquier lógica adicional aquí
  }

  onActionButtonClick(action: any, item: any) {
    if (action && action.action) {
      action.action(item); // Llama a la acción correspondiente
    }
  }

  onEdit(item: any): void {
    this.editItem.emit(item);
  }

  onDelete(item: any): void {
    this.itemToDelete = item;
    this.isModalOpen = true;
  }

  confirmDelete() {
    if (this.itemToDelete) {
      this.deleteItem.emit(this.itemToDelete);
      this.isModalOpen = false;
      this.itemToDelete = null;
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }
}