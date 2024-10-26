import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { SuintPageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { SuintButtonComponent } from "../../../../shared/components/suint-button/suint-button.component";
import { ModalFormComponent } from '../../../../shared/components/modals/modal-form/modal-form.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputCustomComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { ListAllComponent } from '../../../../shared/components/list-all/list-all.component';
import { CommonModule } from '@angular/common';
import { StudentEnrollmentService } from '../../services/student-enrollment.service';
import { CareerOriginService } from '../../services/career-origin.service';
import { UniversityOriginService } from '../../services/university-origin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-academic-student-enrollment',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule, SuintPageHeaderComponent, SuintButtonComponent, ModalFormComponent,InputCustomComponent,ListAllComponent,CommonModule],
  templateUrl: './academic-student-enrollment.component.html'
})
export class AcademicStudentEnrollmentComponent implements OnInit {


  estudiantes: any[] = [];
  estudiantesFiltrados: any[] = [];
  estudiantesConDatos: any[] = [];
  universities: any[] = [];
  careers: any[] = [];
  

  #_formBuilder = inject(FormBuilder);
  private studentEnrollmentService = inject(StudentEnrollmentService);
  private universityService = inject(UniversityOriginService);
  private careerService = inject(CareerOriginService);
  private router = inject(Router);

  contractGroup: FormGroup;

  private createFormGroup(): FormGroup {
    return this.#_formBuilder.group({
      id: new FormControl(0),
      name: new FormControl(''),
      originUniversityId: new FormControl(null),
      originCareerId: new FormControl(null),
      search: new FormControl('')
    });
  }

  @ViewChild('modal') modal!: ModalFormComponent;

  openAddModal() {
    this.modal.openModal();
    this.loadInitialData();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  constructor() {
    this.contractGroup = this.createFormGroup();
    }
  

  onSubmit() {
    if (this.contractGroup.valid) {
      const formData = this.contractGroup.value;
      console.log('Form data:', formData);
      this.studentEnrollmentService.createStudentEnrollment(formData).subscribe({
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

  onAddEstudiante(estudiante: any): void {
    const formData = {
      id: estudiante.id, // Asegúrate de que `id` existe en el objeto estudiante
      name: estudiante.name,
      originUniversityId: this.contractGroup.get('originUniversityId')?.value,
      originCareerId: this.contractGroup.get('originCareerId')?.value,
    };
  
    console.log('Form data to submit:', formData);
    this.studentEnrollmentService.createStudentEnrollment(formData).subscribe({
      next: (response) => {
        console.log('Estudiante agregado:', response);
        this.modal.closeModal();
        this.loadInitialData(); // Recargar datos
      },
      error: (err) => {
        console.error('Error al agregar el estudiante', err);
      },
    });
  }
  

  private loadInitialData(): void {
    this.loadUniversities();
    this.getEstudiantes();
  }

  getEstudiantes(): void {
    this.studentEnrollmentService.getStudentEnrollment().subscribe(estudiantes => {
      this.estudiantes = estudiantes.map(estudiante => {
        // Encuentra la universidad correspondiente
        const universidad = this.universities.find(u => u.id === estudiante.originUniversityId);
        // Usa el ID de la carrera para encontrar el nombre de la carrera
        const carreraId = estudiante.originCareerId; // ID de la carrera del estudiante
        const carrera = this.careers.find(c => c.id === carreraId);
        
        return {
          ...estudiante,
          universityName: universidad ? universidad.name : 'No asignada', // Nombre de la universidad
          careerName: carrera ? carrera.name : 'No asignada' // Nombre de la carrera
        };
      });
  
      console.log('Estudiantes con nombres:', this.estudiantes);
        this.estudiantesFiltrados = this.estudiantes.filter(estudiante =>
        estudiante.originUniversityId === null && estudiante.originCareerId === null
      );
  
      // Filtra estudiantes que tienen universidad y carrera
      this.estudiantesConDatos = this.estudiantes.filter(estudiante =>
        estudiante.originUniversityId !== null && estudiante.originCareerId !== null
      );
  
      console.log('Estudiantes sin asignaciones:', this.estudiantesFiltrados);
      console.log('Estudiantes con asignaciones:', this.estudiantesConDatos);
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
  private loadCareersByUniversity(universityId: number): void {
    this.careerService.getCareerByUniversity(universityId).subscribe({
      next: (data: any[]) => {
        this.careers = data; // Carga las carreras
        console.log('Carreras cargadas:', this.careers); // Verifica los datos
      },
      error: (err) => console.error('Error al obtener las carreras', err)
    });
  }
  
  getSelectValue(event: Event): number {
    const selectElement = event.target as HTMLSelectElement;  // Casting
    return Number(selectElement.value); // Convierte a número aquí
  }  
  
  onDelete(item: any): void {
    const itemId = item.id;
    console.log('Delete item with ID:', itemId);
    this.studentEnrollmentService.deleteStudentEnrollment(itemId).subscribe({
      next: (response) => {
        console.log('Item deleted successfully', response);
        this.loadInitialData();
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

  tableColumns = [
    { header: 'Nombre', field: 'name' },
    { header: 'Universidad', field: 'universityName' }, // Cambiado a 'universityName'
    { header: 'Carrera', field: 'originCareerId' }, // Cambiado a 'careerName'
  ];
  

  additionalColumns = [
    {
      header: 'Asignaturas',
      buttons: [
        { name: 'Unidades', iconSrc: 'assets/icons/icon-subject.svg', action: this.downloadDocument.bind(this) },
      ]
    }
  ];

  downloadDocument(item: any) {
    console.log('Descargando documento para estudiante:', item);
    this.router.navigate(['/academico/relation-subjects'], {
      queryParams: {
        id: item.id,
        name: item.name,
        originCareerId: item.originCareerId,
        originUniversityId: item.originUniversityId
      }
    });
  }
}
