import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { SuintPageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import { ModalFormComponent } from '../../../../shared/components/modals/modal-form/modal-form.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputCustomComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { ContratoService } from '../../../human-resources/services/contrato.service';
import { WorkAreaService } from '../../../human-resources/services/work-area.service';
import { SuintButtonComponent } from '../../../../shared/components/suint-button/suint-button.component';
import { UniversityOriginService } from '../../services/university-origin.service';
import { CareerOriginService } from '../../services/career-origin.service';
import { state } from '@angular/animations';
import { ListAllComponent } from '../../../../shared/components/list-all/list-all.component';

@Component({
  selector: 'app-academic-origin-career-convalidation',
  standalone: true,
  imports: [SvgIconComponent, SuintPageHeaderComponent, CommonModule, ModalFormComponent, ReactiveFormsModule, InputCustomComponent,SuintButtonComponent, ListAllComponent],
  templateUrl: './academic-origin-career-convalidation.component.html',
  styleUrl: './academic-origin-career-convalidation.component.scss'
})
export class AcademicOriginCareerConvalidationComponent implements OnInit {

  @Input() data: any[] = [];
  @Input() columns: { header: string, field: string }[] = [];
  career: any[] = [];
  tableColumns = [
    { header: 'Nombre', field: 'name' },
    { header: '# Asig', field: 'cityId' },
    { header: 'Teléfono', field: 'phone' },
    { header: 'Fecha de inicio', field: 'email' }
  ];



  #_formBuilder = inject(FormBuilder);
  private readonly universityOriginService = inject(UniversityOriginService);  // Inyección del servicio
  private readonly careerOriginService = inject(CareerOriginService);  // Inyección del servicio

  contractGroup: FormGroup;
  universities: any[] = [];  // Lista para almacenar las carreras
  stateOptions: { name: string; value: boolean }[] = [];
  workloadOptions: { name: string }[] = [];

  @ViewChild('modal') modal!: ModalFormComponent;

  constructor() {
    this.contractGroup = this.#_formBuilder.group({
      id: new FormControl(0),
      name: new FormControl(''),
      resolution: new FormControl(''),
      state: new FormControl(''),
      numberWeeks: new FormControl(''),
      academicLevelId: new FormControl(''),
      studyRegimenId: new FormControl(''),
      facultyName: new FormControl(''),
      approvalNote: new FormControl(''),
      universityId: new FormControl(''),
      workload: new FormControl('')
    });
  }

  ngOnInit() {
    this.loadUniversities();
    this.initializeOptions();
    this.loadCareers();
  }

  openAddModal() {
    this.modal.openModal();
}

  loadUniversities() {
      this.universityOriginService.getUniversityOrigins().subscribe({
        next: (response) => {
          this.universities = response;
        },
        error: (error) => {
          console.error('Error al cargar las universidades:', error);
        }
    });
  }

  loadCareers() {
    this.careerOriginService.getCareers().subscribe({
      next: (response) => {
        this.career = response;
      },
      error: (error) => {
        console.error('Error al cargar las universidades:', error);
      }
    });
  }

  initializeOptions() {
    this.stateOptions = [
      { name: 'Activo', value: true },
      { name: 'Inactivo', value: false }
    ];
    this.workloadOptions = [
      { name: 'Semanal' },
      { name: 'Semestral' },
    ];
  }

  register() {
    const careerData = {
      id: this.contractGroup.get('id')?.value,
      name: this.contractGroup.get('name')?.value,
      resolution: this.contractGroup.get('resolution')?.value,
      state: this.contractGroup.get('state')?.value,
      numberWeeks: this.contractGroup.get('numberWeeks')?.value,
      academicLevelId: 1,
      studyRegimenId: 1,
      facultyName: this.contractGroup.get('facultyName')?.value,
      approvalNote: this.contractGroup.get('approvalNote')?.value,
      universityId: this.contractGroup.get('universityId')?.value,
      workload: this.contractGroup.get('workload')?.value
    };
    console.log('Datos a enviar:', careerData);
    if (careerData.id === 0) {
      // Crear nueva carrera
      this.careerOriginService.createCareer(careerData).subscribe({
        next: () => {
          this.loadUniversities();  // Recargar la lista de carreras
          
        },
        error: (error) => console.error('Error al crear la carrera:', error)
      });
    } else {
      this.careerOriginService.updateCareer(careerData).subscribe({
        next: () => {
          this.loadUniversities();
        },
        error: (error) => console.error('Error al actualizar la carrera:', error)
      });
    }
  }


  onUniversityChange(universityId: number): void {
    if (universityId) {
      this.loadCareersByUniversity(universityId);
    }
  }

  private loadCareersByUniversity(universityId: number): void {
    this.careerOriginService.getCareerByUniversity(universityId).subscribe({
      next: (data: any[]) => this.career = data,
      error: (err) => console.error('Error al obtener las carreras', err)
    });
  }

  onEdit(item: any): void {
    this.contractGroup.patchValue(item); // Fill the form with the selected item's data
    this.modal.openModal(); // Open the modal for editing
  }

  onDelete(item: any): void {
    const itemId = item.id;
    console.log('Delete item with ID:', itemId);
    this.careerOriginService.deleteCareer(itemId).subscribe({
      next: (response) => {
        console.log('Item deleted successfully', response);
      },
      error: (error) => {
        console.error('Error deleting item', error);
      }
    });
  }
}