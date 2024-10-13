import { ChangeDetectorRef, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { SuintPageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { InputCustomComponent } from "../../../../shared/components/custom-input/custom-input.component";
import { SuintButtonComponent } from "../../../../shared/components/suint-button/suint-button.component";
import { ModalFormComponent } from "../../../../shared/components/modals/modal-form/modal-form.component";
import { CommonModule } from '@angular/common';
import { ListAllComponent } from "../../../../shared/components/list-all/list-all.component";
import { SubjectOriginService } from '../../services/subject-origin.service';
import { UniversityOriginService } from '../../services/university-origin.service';
import { CareerOriginService } from '../../services/career-origin.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputDirective } from '../../../../shared/directives/input.directive';

@Component({
  selector: 'app-academic-subject-origin',
  standalone: true,
  imports: [FormsModule, SuintPageHeaderComponent, InputCustomComponent, SuintButtonComponent, ModalFormComponent, CommonModule, ListAllComponent,ReactiveFormsModule,InputDirective],
  templateUrl: './academic-subject-origin.component.html',
  styleUrl: './academic-subject-origin.component.scss'
})
export class AcademicSubjectOriginComponent implements OnInit{
  #_formBuilder = inject(FormBuilder);
  private subjectService = inject(SubjectOriginService);
  private universityService = inject(UniversityOriginService);
  private careerService = inject(CareerOriginService);

  // Definimos el FormGroup
  contractGroup: FormGroup;

  // Variables para almacenar datos
  subjects: any[] = [];
  universities: any[] = [];
  careers: any[] = [];

  @ViewChild('modal') modal!: ModalFormComponent;
  // Inicializamos las columnas de la tabla
  tableColumns = [
    { header: 'Nro. asignatura', field: 'code' },
    { header: 'Nombre', field: 'name' },
    { header: 'Total Horas', field: 'status' },
    { header: 'Semestre', field: 'semester' },
    { header: 'Fecha de inicio', field: 'startDate' }
  ];

  constructor() {
    this.contractGroup = this.createFormGroup();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  // Creamos el FormGroup
  private createFormGroup(): FormGroup {
    return this.#_formBuilder.group({
      id: new FormControl(0),
      code: new FormControl(''),
      name: new FormControl(''),
      semester: new FormControl(''),
      hourlyLoad: new FormControl(''),
      status: new FormControl(false),
      universityId: new FormControl(''),
      originCareerId: new FormControl(''),
    });
  }

  // Cargamos los datos iniciales (asignaturas y universidades)
  private loadInitialData(): void {
    this.loadUniversities();
  }

  // Método para abrir el modal
  openAddModal() {
    this.modal.openModal();
  }

  // Cargamos las universidades
  private loadUniversities(): void {
    this.universityService.getUniversityOrigins().subscribe({
      next: (data: any[]) => this.universities = data,
      error: (err) => console.error('Error al obtener las universidades', err)
    });
  }

  // Método para manejar el cambio de universidad seleccionada
  onUniversityChange(universityId: number): void {
    if (universityId) {
      this.loadCareersByUniversity(universityId);
    }
  }

  // Método para manejar el cambio de carrera seleccionada
  onCareerChange(originCareerId: number): void {
    if (originCareerId) {
      this.loadSubjectsByCareer(originCareerId);
    }
  }

  // Cargamos las carreras según la universidad seleccionada
  private loadCareersByUniversity(universityId: number): void {
    this.careerService.getCareerByUniversity(universityId).subscribe({
      next: (data: any[]) => this.careers = data,
      error: (err) => console.error('Error al obtener las carreras', err)
    });
  }

  // Cargamos las carreras según la carrera seleccionada
  private loadSubjectsByCareer(originCareerId: number): void {
    this.subjectService.getSubjectByCareer(originCareerId).subscribe({
      next: (data: any[]) => this.subjects = data,
      error: (err) => console.error('Error al obtener las asignaturas', err)
    });
  }

  onSubmit() {
    if (this.contractGroup.valid) {
      const formData = this.contractGroup.value;

      this.subjectService.createSubject(formData).subscribe({
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
}