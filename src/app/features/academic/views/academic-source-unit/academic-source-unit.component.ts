// Otros imports
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalFormComponent } from '../../../../shared/components/modals/modal-form/modal-form.component';
import { AcademicSourceUnitService } from '../../services/academic-source-unit.service';
import { CommonModule } from '@angular/common';
import { SuintPageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { ListAllComponent } from "../../../../shared/components/list-all/list-all.component";
import { SuintButtonComponent } from "../../../../shared/components/suint-button/suint-button.component";

@Component({
  selector: 'app-academic-source-unit',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, SuintPageHeaderComponent, ListAllComponent, SuintButtonComponent, ModalFormComponent],
  templateUrl: './academic-source-unit.component.html',
})
export class AcademicSourceUnitComponent implements OnInit {
  @ViewChild('modal') modal!: ModalFormComponent;
  private readonly unitOriginService = inject(AcademicSourceUnitService);

  contractGroup: FormGroup;
  #_formBuilder = inject(FormBuilder);
  deletedUnits: number[] = []; // Array para almacenar los IDs de las unidades eliminadas

  constructor() {
    this.contractGroup = this.createFormGroup();
  }

  private createFormGroup(): FormGroup {
    return this.#_formBuilder.group({
      units: this.#_formBuilder.array([]), // Inicializar como un FormArray vacío
    });
  }

  private createUnit(unitData: any): FormGroup {
    return this.#_formBuilder.group({
      id: new FormControl(unitData.id || 0),
      name: new FormControl(unitData.name || ''),
      topic: new FormControl(unitData.topic || ''),
      selected: new FormControl(false),
      number: new FormControl(unitData.number || 0),
      sourceSubjectId: new FormControl(unitData.sourceSubjectId || 3),
    });
  }

  get units(): FormArray {
    return this.contractGroup.get('units') as FormArray;
  }

  private loadInitialData(): void {
    // Lógica para cargar datos iniciales
    this.unitOriginService.getCareerByIdSubject(3).subscribe({
      next: (units) => {
        this.populateUnits(units); // Llenar el FormArray con las unidades obtenidas
        this.ensureAtLeastOneUnit(); // Asegurarse de que haya al menos una unidad
      },
      error: (err) => {
        console.error('Error al obtener las unidades', err);
        this.ensureAtLeastOneUnit(); // Asegurarse de que haya al menos una unidad incluso si hay un error
      },
    });
  }

  private ensureAtLeastOneUnit() {
    
  }

  ngOnInit() {
    this.loadInitialData();
  
    // Asegúrate de que siempre haya al menos un grupo de inputs
    if (this.units.length === 0) {
      this.addUnit(); // Agrega un grupo de inputs si no hay unidades
    }
  }

  openAddModal() {
    // Obtener las unidades del sujeto con ID 3
    this.unitOriginService.getCareerByIdSubject(3).subscribe({
      next: (units) => {
        this.populateUnits(units); // Llenar el FormArray con las unidades obtenidas
        this.modal.openModal(); // Abrir el modal
      },
      error: (err) => {
        console.error('Error al obtener las unidades', err);
      },
    });
  }

  private populateUnits(units: any[]) {
    this.units.clear(); // Limpiar el FormArray antes de llenarlo
  
    if (units.length === 0) {
      // Si no hay unidades, añadir un grupo de inputs vacío
      this.units.push(this.createUnit({})); // Añadir un grupo vacío
      this.sortUnits(); // Ordenar las unidades
    } else {
      units.sort((a, b) => a.number - b.number); // Ordenar las unidades por número
      units.forEach(unit => this.units.push(this.createUnit(unit))); // Agregar unidades al FormArray
    }
  }

  addUnit() {
    // Limitar a un máximo de 5 unidades
    if (this.units.length < 5) {
      const currentNumbers = this.units.controls.map(unit => unit.get('number')?.value);
      let newUnitNumber = 1;
  
      // Encontrar el siguiente número disponible
      while (currentNumbers.includes(newUnitNumber)) {
        newUnitNumber++;
      }
  
      // Agregar una nueva unidad con el número disponible
      this.units.push(this.createUnit({ number: newUnitNumber }));
    }
  }
  
  

  removeUnit() {
    if (this.units.length > 1) {
      const selectedIndex = this.units.controls.findIndex(unit => unit.get('selected')?.value);
      if (selectedIndex !== -1) {
        const unitId = this.units.at(selectedIndex).get('id')?.value; // Obtener el ID de la unidad eliminada
        this.deletedUnits.push(unitId); // Agregar el ID al array de eliminados
        this.units.removeAt(selectedIndex); // Eliminar la unidad del FormArray
      } else {
        this.units.removeAt(this.units.length - 1); // Eliminar la última unidad
      }
    }
  }

  sortUnits() {
    const currentControls = this.units.controls.slice();
    currentControls.sort((a, b) => {
      const numberA = a.get('number')?.value || 0;
      const numberB = b.get('number')?.value || 0;
      return numberA - numberB;
    });
    currentControls.forEach((unit, index) => {
      unit.get('number')?.setValue(index + 1); 
    });
    const sortedFormArray = this.#_formBuilder.array(currentControls);
    this.contractGroup.setControl('units', sortedFormArray);
  }

  doubleSortUnits() {
    this.sortUnits();
    setTimeout(() => this.sortUnits(), 0);
  }

  onEdit(item: any): void {
    this.contractGroup.patchValue(item); 
    this.modal.openModal();
  }

  onSubmit() {
    if (this.contractGroup.valid) {
      const formData = this.contractGroup.value;

      // Procesar cada unidad por separado
      formData.units.forEach((unit: any) => {
        const unitData = {
          id: unit.id,
          name: unit.name,
          number: unit.number,
          selected: unit.selected,
          sourceSubjectId: unit.sourceSubjectId,
          topic: unit.topic,
        };

        console.log('Unit data:', unitData);
        
        // Enviar unidad a crear o actualizar
        this.unitOriginService.createUnit(unitData).subscribe({
          next: (response) => {
            console.log('Asignatura creada:', response);
          },
          error: (err) => {
            console.error('Error al crear la asignatura', err);
          },
        });
      });

      // Eliminar unidades que fueron marcadas para ser eliminadas
      this.deletedUnits.forEach((id) => {
        this.unitOriginService.deleteUnit(id).subscribe({
          next: (response) => {
            console.log('Asignatura eliminada:', response);
          },
          error: (err) => {
            console.error('Error al eliminar la asignatura', err);
          },
        });
      });

      this.modal.closeModal();
      this.loadInitialData(); // Recargar datos
    }
  }
}
