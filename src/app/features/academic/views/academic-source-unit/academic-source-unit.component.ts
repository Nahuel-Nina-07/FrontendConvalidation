import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalFormComponent } from '../../../../shared/components/modals/modal-form/modal-form.component';
import { AcademicSourceUnitService } from '../../services/academic-source-unit.service';
import { CommonModule } from '@angular/common';
import { SuintPageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { ListAllComponent } from "../../../../shared/components/list-all/list-all.component";
import { SuintButtonComponent } from "../../../../shared/components/suint-button/suint-button.component";

@Component({
  selector: 'app-academic-source-unit',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, SuintPageHeaderComponent, ListAllComponent, SuintButtonComponent,ModalFormComponent],
  templateUrl: './academic-source-unit.component.html',
})
export class AcademicSourceUnitComponent implements OnInit {
  #_formBuilder = inject(FormBuilder);

  private sourceUnitService = inject(AcademicSourceUnitService);

  contractGroup: FormGroup;

  @ViewChild('modal') modal!: ModalFormComponent;

  openAddModal() {
    this.modal.openModal();
    this.contractGroup.reset({
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  constructor() {
    this.contractGroup = this.createFormGroup();
  }

  private loadInitialData(): void {
    
  }

  private createFormGroup(): FormGroup {
    return this.#_formBuilder.group({
      id: new FormControl(0),
      number: new FormControl(''),
      name: new FormControl(''),
      topic: new FormControl(''),
      sourceSubjectId: new FormControl(0),
    });
  }

  

  onSubmit() {
    if (this.contractGroup.valid) {
      const formData = this.contractGroup.value;
      console.log('Form data:', formData);
      this.sourceUnitService.createUnit(formData).subscribe({
        next: (response) => {
          console.log('Asignatura creada:', response);
          this.modal.closeModal();
          this.loadInitialData(); // Recargar datos
        },
        error: (err) => {
          console.error('Error al crear la asignatura', err);
        },
      });
    } else {
      console.log('El formulario es inválido');
    }
  }

  onDelete(item: any): void {
    const itemId = item.id;
    console.log('Delete item with ID:', itemId);
    this.sourceUnitService.deleteUnit(itemId).subscribe({
      next: (response) => {
        console.log('Item deleted successfully', response);
      },
      error: (error) => {
        console.error('Error deleting item', error);
      }
    });
  }

  onEdit(item: any): void {
    this.contractGroup.patchValue(item);
    this.modal.openModal();
  }
}
