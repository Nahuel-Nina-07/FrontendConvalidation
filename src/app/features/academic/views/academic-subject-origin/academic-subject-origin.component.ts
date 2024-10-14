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

  contractGroup: FormGroup;

  subjects: any[] = [];
  universities: any[] = [];
  careers: any[] = [];
  workloadOptions: { name: string }[] = [];

  initializeOptions() {
    this.workloadOptions = [
      { name: 'Semanal' },
      { name: 'Semestral' },
      { name: 'Anual' },
    ];
  }

  @ViewChild('modal') modal!: ModalFormComponent;
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
      typeHours: new FormControl(0),
    });
  }

  openAddModal() {
    this.modal.openModal();
    const universityId = this.contractGroup.get('universityId')?.value;
    const originCareerId = this.contractGroup.get('originCareerId')?.value;
    const id = this.contractGroup.get('id')?.value;
    const status = this.contractGroup.get('status')?.value;
    
    this.contractGroup.reset({
      id: id,
      universityId: universityId,
      originCareerId: originCareerId,
      status: status
    });
  }

  private loadUniversities(): void {
    this.universityService.getUniversityOrigins().subscribe({
      next: (data: any[]) => this.universities = data,
      error: (err) => console.error('Error al obtener las universidades', err)
    });
  }

  onUniversityChange(universityId: number): void {
    if (universityId) {
      this.loadCareersByUniversity(universityId);
    }
  }

  onCareerChange(originCareerId: number): void {
    if (originCareerId) {
      this.loadSubjectsByCareer(originCareerId);
    }
  }

  private loadCareersByUniversity(universityId: number): void {
    this.careerService.getCareerByUniversity(universityId).subscribe({
      next: (data: any[]) => this.careers = data,
      error: (err) => console.error('Error al obtener las carreras', err)
    });
  }

  private loadSubjectsByCareer(originCareerId: number): void {
    this.subjectService.getSubjectByCareer(originCareerId).subscribe({
      next: (data: any[]) => this.subjects = data,
      error: (err) => console.error('Error al obtener las asignaturas', err)
    });
  }

  private loadInitialData(): void {
    this.initializeOptions();
    this.loadUniversities();

    const selectedUniversityId = this.contractGroup.get('universityId')?.value;
    if (selectedUniversityId) {
      this.loadCareersByUniversity(selectedUniversityId);
    }

    const selectedCareerId = this.contractGroup.get('originCareerId')?.value;
    if (selectedCareerId) {
      this.loadSubjectsByCareer(selectedCareerId);
    }
  }

  onSubmit() {
    if (this.contractGroup.valid) {
      const formData = this.contractGroup.value;
      console.log('Form data:', formData);
      this.subjectService.createSubject(formData).subscribe({
        next: (response) => {
          console.log('Asignatura creada:', response);
          this.modal.closeModal();

          const selectedUniversityId = this.contractGroup.get('universityId')?.value;
          const selectedCareerId = this.contractGroup.get('originCareerId')?.value;

          if (selectedUniversityId) {
            this.loadCareersByUniversity(selectedUniversityId);
          }

          if (selectedCareerId) {
            this.loadSubjectsByCareer(selectedCareerId);
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


  onDelete(item: any): void {
    const itemId = item.id;
    console.log('Delete item with ID:', itemId);
    this.subjectService.deleteSubject(itemId).subscribe({
      next: (response) => {
        console.log('Item deleted successfully', response);
  
        // Recargar la lista de asignaturas después de la eliminación
        const selectedCareerId = this.contractGroup.get('originCareerId')?.value;
        if (selectedCareerId) {
          this.loadSubjectsByCareer(selectedCareerId);
        }
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