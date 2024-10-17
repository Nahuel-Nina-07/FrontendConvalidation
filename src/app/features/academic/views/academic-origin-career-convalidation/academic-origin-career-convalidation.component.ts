import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit, ViewChild } from '@angular/core';
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
  styleUrl: './academic-origin-career-convalidation.component.scss',
})
export class AcademicOriginCareerConvalidationComponent implements OnInit {

  @Input() data: any[] = [];
  @Input() columns: { header: string, field: string }[] = [];
  career: any[] = [];

  #_formBuilder = inject(FormBuilder);
  private readonly universityOriginService = inject(UniversityOriginService);  // Inyección del servicio
  private readonly careerOriginService = inject(CareerOriginService);  // Inyección del servicio

  contractGroup: FormGroup;
  universities: any[] = [];  // Lista para almacenar las carreras

  @ViewChild('modal') modal!: ModalFormComponent;

  constructor() {
    this.contractGroup = this.createFormGroup();
  }

  ngOnInit() {    
    this.loadInitialData();
  }

  openAddModal() {
    this.modal.openModal();
    const id = this.contractGroup.get('id')?.value;
    const academicLevelId = this.contractGroup.get('academicLevelId')?.value;
    const studyRegimenId = this.contractGroup.get('studyRegimenId')?.value;
    const universityId = this.contractGroup.get('universityId')?.value;
    const state = this.contractGroup.get('state')?.value;
    this.contractGroup.reset({
      id: id,
      academicLevelId: academicLevelId,
      studyRegimenId: studyRegimenId,
      universityId: universityId,
      state: state
    });
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


  tableColumns = [
    { header: 'Nro. asignatura', field: 'code' },
    { header: 'Nombre', field: 'name' },
    { header: 'Total Horas', field: 'state' },
    { header: 'Semestre', field: 'semester' },
    { header: 'Fecha de inicio', field: 'startDate' }
  ];

  private createFormGroup(): FormGroup {
    return this.#_formBuilder.group({
      id: new FormControl(0),
      name: new FormControl(''),
      resolution: new FormControl(''),
      state: new FormControl(false),
      numberWeeks: new FormControl(''),
      academicLevelId: 1,
      studyRegimenId: 1,
      facultyName: new FormControl(''),
      approvalNote: new FormControl(''),
      universityId: new FormControl(''),
      workload: new FormControl(''),
    });
  }

  private loadInitialData(): void {
    this.loadUniversities();
    this.loadCareers();
  }

  onSubmit() {
    if (this.contractGroup.valid) {
      const formData = this.contractGroup.value;
      console.log('Form data:', formData);
      this.careerOriginService.createCareer(formData).subscribe({
        next: (response) => {
          console.log('Asignatura creada:', response);
          this.modal.closeModal();
          const selectedUniversityId = this.contractGroup.get('universityId')?.value;
          if (selectedUniversityId) {
            this.loadCareersByUniversity(selectedUniversityId);
          }
        },
        error: (err) => {
          console.error('Error al crear la asignatura', err);
        },
      });
    } else {
      console.log('El formulario es inválido');
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
    this.contractGroup.patchValue(item); 
    this.modal.openModal();
  }

  onDelete(item: any): void {
    const itemId = item.id;
    console.log('Delete item with ID:', itemId);
    this.careerOriginService.deleteCareer(itemId).subscribe({
      next: (response) => {
        console.log('Item deleted successfully', response);
        const selectedUniversityId = this.contractGroup.get('universityId')?.value;
        
        if (selectedUniversityId) {
          this.loadCareersByUniversity(selectedUniversityId);
        }
        else {
          this.loadCareers();
        }
      },
      error: (error) => {
        console.error('Error deleting item', error);
      }
    });
  }
}