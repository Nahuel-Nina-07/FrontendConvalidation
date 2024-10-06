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

@Component({
  selector: 'app-academic-origin-career-convalidation',
  standalone: true,
  imports: [SvgIconComponent, SuintPageHeaderComponent, CommonModule, ModalFormComponent, ReactiveFormsModule, InputCustomComponent,SuintButtonComponent],
  templateUrl: './academic-origin-career-convalidation.component.html',
  styleUrl: './academic-origin-career-convalidation.component.scss'
})
export class AcademicOriginCareerConvalidationComponent implements OnInit {
  #_formBuilder = inject(FormBuilder);
  private readonly universityOriginService = inject(UniversityOriginService);  // Inyección del servicio
  private readonly careerOriginService = inject(CareerOriginService);  // Inyección del servicio

  @Input() data: any[] = [];

  // Recibe la configuración de las columnas (nombre y campo a mostrar)
  @Input() columns: { header: string, field: string }[] = [];

  contractGroup: FormGroup;
  universities: any[] = [];  // Lista para almacenar las carreras
  faculties: any[] = [];  // Lista para almacenar las facultades
  stateOptions: { name: string; value: boolean }[] = [];
  workloadOptions: { name: string }[] = [];

  @ViewChild('modal') modal!: ModalFormComponent;

  constructor() {
    this.contractGroup = this.#_formBuilder.group({
      id: new FormControl(0),
      name: new FormControl(''),
      resolutionDate: new FormControl(''),
      state: new FormControl(''),
      numberWeeks: new FormControl(''),
      academicLevelId: new FormControl(''),
      studyRegimenId: new FormControl(''),
      facultyId: new FormControl(''),
      approvalNote: new FormControl(''),
      universityId: new FormControl(''),
      employeeId: new FormControl(''),
      workload: new FormControl('')
    });
  }

  ngOnInit() {
    this.loadUniversities();  // Cargar carreras al inicio
    this.loadFaculties();  // Cargar facultades al inicio
    this.initializeOptions();  // Inicializar las opciones de estado y carga horaria
  }

  clearForm() {
    this.contractGroup.reset({
      id: 0,
      name: '',
      resolutionDate: '',
      state:'',
      numberWeeks: '',
      academicLevelId: '',
      studyRegimenId: '',
      facultyId: '',
      approvalNote: '',
      universityId: '',
      employeeId: '',
      workload: ''
    });
  }
  openAddModal() {
     // Al abrir el modal para agregar, no hay ID seleccionado
    this.clearForm();
    this.modal.openModal();
     // Recarga la página
}

  // Método para cargar las carreras
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

  // Método para cargar facultades
  loadFaculties() {
    this.careerOriginService.getFacultyAll().subscribe({
      next: (response) => {
        this.faculties = response;
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

  // Método para registrar o crear una nueva carrera
  register() {
    const careerData = {
      id: this.contractGroup.get('id')?.value,
      name: this.contractGroup.get('name')?.value,
      resolutionDate: this.contractGroup.get('resolutionDate')?.value,
      state: this.contractGroup.get('state')?.value,
      numberWeeks: this.contractGroup.get('numberWeeks')?.value,
      // academicLevelId: this.contractGroup.get('academicLevelId')?.value,
      // studyRegimenId: this.contractGroup.get('studyRegimenId')?.value,
      academicLevelId: 1,
      studyRegimenId: 1,
      facultyId: this.contractGroup.get('facultyId')?.value,
      approvalNote: this.contractGroup.get('approvalNote')?.value,
      universityId: this.contractGroup.get('universityId')?.value,
      // employeeId: this.contractGroup.get('employeeId')?.value,
      employeeId: 1,  
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
      // Actualizar carrera existente
      this.careerOriginService.updateCareer(careerData).subscribe({
        next: () => {
          this.loadUniversities();
          this.loadFaculties();
          // Recargar la lista de carreras
            // Limpiar el formulario
        },
        error: (error) => console.error('Error al actualizar la carrera:', error)
      });
    }
  }

}