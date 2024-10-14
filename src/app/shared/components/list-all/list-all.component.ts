// In list-all.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'suint-list-all',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './list-all.component.html'
})
export class ListAllComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() text: string = 'Nuevo';  // Texto por defecto
  @Input() iconSrc: string = 'assets/icons/icon-add.svg';

  @Output() deleteItem: EventEmitter<any> = new EventEmitter();
  @Output() editItem: EventEmitter<any> = new EventEmitter(); // Add this line

  onEdit(item: any): void {
    this.editItem.emit(item); // Emit the edit event
  }

  onDelete(item: any): void {
    const confirmDelete = confirm(`Are you sure you want to delete ${item.name}?`);
    if (confirmDelete) {
      this.deleteItem.emit(item); // Emit the delete event
    }
  }
}
