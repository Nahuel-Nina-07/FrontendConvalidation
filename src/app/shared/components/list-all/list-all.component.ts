import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { ModalOptionComponent } from '../modals/modal-option/modal-option.component';
import { SuintButtonComponent } from "../suint-button/suint-button.component";

@Component({
  selector: 'suint-list-all',
  standalone: true,
  imports: [CommonModule, SvgIconComponent, ModalOptionComponent, SuintButtonComponent],
  templateUrl: './list-all.component.html'
})
export class ListAllComponent {
  @Input() isNewVisible: boolean = false; 
  @Input() isEditVisible: boolean = true;  // Controla la visibilidad del botón de editar
  @Input() isDeleteVisible: boolean = true;

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

  // Nuevo método para agregar un grupo a la lista
  addNewGroup() {
    if (this.isNewVisible) {
      const newGroup = {
        // Aquí puedes definir la estructura de tu nuevo grupo
        id: this.data.length + 1, // Genera un nuevo ID
        name: 'Nuevo Grupo ' + (this.data.length + 1) // Cambia el nombre si es necesario
      };

      // Agrega el nuevo grupo a la lista de datos
      this.data.push(newGroup);
    }
  }
}

