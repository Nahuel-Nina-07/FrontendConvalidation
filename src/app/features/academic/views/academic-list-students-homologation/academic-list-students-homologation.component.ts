import { Component, OnInit, ViewChild } from '@angular/core';
import { SuintPageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { ListAllComponent } from "../../../../shared/components/list-all/list-all.component";
import { SuintButtonComponent } from "../../../../shared/components/suint-button/suint-button.component";
import { Student, UpdatedStudent } from '../../services/homologation/estudent';
import { AcadeicListStudentsService } from '../../services/homologation/acadeic-list-students.service';
import { Router } from '@angular/router';
import { ModalFormComponent } from "../../../../shared/components/modals/modal-form/modal-form.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomologationMateriasService } from '../../services/homologation/homologation-materias.service';
import { ModalOptionComponent } from "../../../../shared/components/modals/modal-option/modal-option.component";

@Component({
  selector: 'app-academic-list-students-homologation',
  standalone: true,
  imports: [FormsModule, SuintPageHeaderComponent, ListAllComponent, SuintButtonComponent, ModalFormComponent, CommonModule],
  templateUrl: './academic-list-students-homologation.component.html',
  styleUrl: './academic-list-students-homologation.component.scss'
})
export class AcademicListStudentsHomologationComponent implements OnInit {
  estudiantes: Student[] = [];
  estudiantesConEstadoTrue: Student[] = [];
  estudiantesConEstadoFalse: Student[] = [];
  filteredStudents: Student[] = [];
  filteredModalStudents: Student[] = [];
  searchQueryMain: string = ''; // Para la lista principal
  searchQueryModal: string = '';

  constructor(
    private academicListStudentsService: AcadeicListStudentsService,
    private academicListStudents: HomologationMateriasService,
    private router: Router
  ) {}

  @ViewChild('modal') modal!: ModalFormComponent;

  ngOnInit(): void {
    this.getAllStudents();
  }

  tableColumns = [
    { header: 'Nombre', field: 'nombre' },
    { header: 'Carrera', field: 'carrera.careerName' },
  ];

  additionalColumns = [
    {
      header: 'Pensums',
      buttons: [
        { name: 'Unidades', iconSrc: 'assets/icons/icon-subject.svg', action: this.downloadDocument.bind(this) },
        { name: 'Eliminar de la lista', iconSrc: 'assets/icons/icon-trashs.svg', action: this.updateStudentToFalse.bind(this) },
      ],
    },
  ];

  getAllStudents(): void {
    this.academicListStudentsService.getStudents().subscribe(
      (data: Student[]) => {
        console.log('Datos recibidos del backend:', data);
        this.estudiantes = data.map(student => ({
          ...student,
          fullName: `${student.nombre}`,
        }));
        this.estudiantesConEstadoTrue = this.estudiantes.filter(student => student.estado);
        this.estudiantesConEstadoFalse = this.estudiantes.filter(student => !student.estado);
        this.filteredStudents = this.estudiantesConEstadoTrue;
        this.filteredModalStudents = this.estudiantesConEstadoFalse;
      },
      (error) => {
        console.error('Error al obtener estudiantes:', error);
      }
    );
  }

  filterModalStudents(): void {
    const query = this.searchQueryModal.trim().toLowerCase();
    this.filteredModalStudents = this.estudiantesConEstadoFalse.filter(student =>
      student.nombre.toLowerCase().includes(query)
    );
  }
  

  filterMainList(): void {
    const query = this.searchQueryMain.trim().toLowerCase();
    this.filteredStudents = this.estudiantesConEstadoTrue.filter(student =>
      student.nombre.toLowerCase().includes(query)
    );
  }
  
  

  addStudent(student: Student): void {
    console.log('Estudiante agregado:', student);
    alert(`Estudiante ${student.nombre} agregado con éxito`);
  }

  openAddModal(): void {
    this.modal.openModal();
  }

  downloadDocument(item: Student): void {
    console.log('Redirigiendo a documentos para estudiante:', item);
    this.router.navigate(['/academico/LisAprovelSubjectsStudents'], {
      queryParams: { id: item.id },
    });
  }

  updateStudentToTrue(student: Student): void {
    const updatedStudent: UpdatedStudent = {
      id: student.id,
      nombre: student.nombre,
      carreraId: student.carrera.id,
      pensumId: student.pensumId,
      estado: true,
    };
  
    console.log('Datos enviados:', updatedStudent);
  
    this.academicListStudents.updateEstudainte(updatedStudent).subscribe(
      (response) => {
        console.log('Estudiante actualizado:', response);
        this.getAllStudents(); // Refresca la lista
        this.modal.closeModal(); // Cierra el modal
      },
      (error) => {
        console.error('Error al actualizar estudiante:', error);
      }
    );
  }

  updateStudentToFalse(student: Student): void {
    const updatedStudent: UpdatedStudent = {
      id: student.id,
      nombre: student.nombre,
      carreraId: student.carrera.id,
      pensumId: student.pensumId,
      estado: false,
    };
  
    console.log('Datos enviados:', updatedStudent);
  
    this.academicListStudents.updateEstudainte(updatedStudent).subscribe(
      (response) => {
        console.log('Estudiante actualizado:', response);
        this.getAllStudents();
      },
      (error) => {
        console.error('Error al actualizar estudiante:', error);
      }
    );
  }  
  isOpen: boolean = false; 
  onCancel() {
    this.isOpen = false;
  }
}
