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
  imports: [ReactiveFormsModule, FormsModule, CommonModule, SuintPageHeaderComponent, ListAllComponent, SuintButtonComponent,ModalFormComponent],
  templateUrl: './academic-source-unit.component.html',
})
export class AcademicSourceUnitComponent implements OnInit {
  @ViewChild('modal') modal!: ModalFormComponent;
  private readonly unitOriginService = inject(AcademicSourceUnitService);

  contractGroup: FormGroup;

  #_formBuilder = inject(FormBuilder);

  constructor() {
    this.contractGroup = this.createFormGroup();
  }

  private createFormGroup(): FormGroup {
    return this.#_formBuilder.group({
      units: this.#_formBuilder.array([this.createUnit(1)]), // Inicializar con un FormGroup
    });
  }

  private createUnit(number: number): FormGroup {
    return this.#_formBuilder.group({
      id: new FormControl(0),
      name: new FormControl(''),
      topic: new FormControl(''),
      selected: new FormControl(false),
      number: new FormControl(number),
      sourceSubjectId:new FormControl(3),
    });
  }

  get units(): FormArray {
    return this.contractGroup.get('units') as FormArray;
  }

  private loadInitialData(): void {
  }

  ngOnInit() {
    this.loadInitialData();
  }

  openAddModal() {
    this.modal.openModal();
  }

  addUnit() {
    if (this.units.length < 5) {
      const currentNumbers = this.units.controls.map(unit => unit.get('number')?.value);
      let newUnitNumber = 1;
      while (currentNumbers.includes(newUnitNumber)) {
        newUnitNumber++;
      }
      this.units.push(this.createUnit(newUnitNumber));
    }
  }

  removeUnit() {
    if (this.units.length > 1) {
      const selectedIndex = this.units.controls.findIndex(unit => unit.get('selected')?.value);
      if (selectedIndex !== -1) {
        this.units.removeAt(selectedIndex);
      } else {
        this.units.removeAt(this.units.length - 1);
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
    setTimeout(() => this.sortUnits(), 0,1);
  }

  onEdit(item: any): void {
    this.contractGroup.patchValue(item); 
    this.modal.openModal();
  }

  onSubmit() {
    if (this.contractGroup.valid) {
      const formData = this.contractGroup.value;
      
      // Process each unit separately
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
        
        this.unitOriginService.createUnit(unitData).subscribe({
          next: (response) => {
            console.log('Asignatura creada:', response);
            this.modal.closeModal();
            this.loadInitialData(); // Recargar datos
          },
          error: (err) => {
            console.error('Error al crear la asignatura', err);
          },
        });
      });
    }
  }
  
}