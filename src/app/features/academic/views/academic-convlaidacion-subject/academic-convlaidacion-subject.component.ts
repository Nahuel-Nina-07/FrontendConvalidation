import { Component, inject, OnInit } from '@angular/core';
import { AcademicSubjetRelationService } from '../../services/academic-subjet-relation.service';
import { CommonModule } from '@angular/common';
import { StudentEnrollmentService } from '../../services/student-enrollment.service';
import { FormsModule } from '@angular/forms';
import { SubjectOriginService } from '../../services/subject-origin.service';

interface Student {
  id: number;
  name: string;
}

interface SourceSubject {
  id: number;
  name: string;
  code: string;
}

interface Subject {
  id: number;
  subjectName: string;
  subjectFaculty: string;
  subjectCareer: string;
  subjectCode: string;
}

@Component({
  selector: 'app-academic-convlaidacion-subject',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './academic-convlaidacion-subject.component.html',
  styleUrls: ['./academic-convlaidacion-subject.component.scss']
})
export class AcademicConvlaidacionSubjectComponent implements OnInit {
  private subjectRelationService = inject(AcademicSubjetRelationService);
  private studentEnrollmentService = inject(StudentEnrollmentService);
  private subjectOriginService = inject(SubjectOriginService);

  isModalOpen = false;
  existingPercentageContent = 0;

  students: Student[] = []; // Lista de estudiantes para el select
  sourceSubjects: SourceSubject[] = []; // Lista de SourceSubject para el select
  subjects: Subject[] = []; // Lista de Subject para el select

  // Objeto que representa la relación inicial
  newSubjectRelation = {
    id: 0,
    date: new Date().toISOString(),
    status: true,
    percentageContent: 0,
    technicalId: 0,
    sourceSubjectOriginId: null,
    subjectId: null,
    studentEnrollmentId: null // Inicializar sin ID de estudiante
  };

  constructor() {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadSourceSubjects();
    this.loadSubjects();
  }

  loadStudents() {
    this.studentEnrollmentService.getStudentEnrollment().subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => {
        console.error('Error al obtener estudiantes:', error);
      }
    });
  }

  loadSourceSubjects() {
    this.subjectOriginService.getSubject().subscribe({
      next: (sourceSubjects) => {
        this.sourceSubjects = sourceSubjects;
      },
      error: (error) => {
        console.error('Error al obtener SourceSubjects:', error);
      }
    });
  }

  loadSubjects() {
    this.subjectOriginService.getSubjectsUAB().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
      },
      error: (error) => {
        console.error('Error al obtener Subjects:', error);
      }
    });
  }

  openModal() {
    this.checkForMatchingRelation();
  }

  checkForMatchingRelation() {
    console.log('Datos enviados para la nueva relación:', this.newSubjectRelation);
  
    this.subjectRelationService.getSubjectRelation()
      .subscribe({
        next: (subjectRelations) => {
          console.log('Relaciones existentes para comparar:', subjectRelations);
  
          const matchingRelation = subjectRelations.find(relation =>
            Number(relation.sourceSubjectOriginId) === Number(this.newSubjectRelation.sourceSubjectOriginId) &&
            Number(relation.subjectId) === Number(this.newSubjectRelation.subjectId)
          );
  
          if (matchingRelation) {
            console.log('Relación coincidente encontrada:', matchingRelation);
            // Guardamos el porcentaje de contenido existente y mostramos el modal
            this.existingPercentageContent = matchingRelation.percentageContent;
            this.isModalOpen = true;
          } else {
            console.log('No se encontró una relación coincidente; no se creará ninguna nueva relación.');
          }
        },
        error: (error) => {
          console.error('Error al obtener relaciones de asignatura:', error);
        }
      });
  }
  
  onConfirm(useExistingPercentage: boolean) {
    this.isModalOpen = false; // Cerramos el modal
    if (useExistingPercentage) {
      // Si se confirma, creamos la relación con el porcentaje existente
      this.createSubjectRelationWithPercentage(this.existingPercentageContent);
    } else {
      console.log('Se seleccionó "No"; no se creará ninguna relación nueva.');
    }
  }
  
  createSubjectRelationWithPercentage(percentage: number) {
    const updatedRelation = {
      ...this.newSubjectRelation,
      percentageContent: percentage
    };
  
    this.subjectRelationService.createSubjectRelation(updatedRelation)
      .subscribe({
        next: (response) => {
          console.log('Relación de asignatura creada:', response);
        },
        error: (error) => {
          console.error('Error al crear la relación de asignatura:', error);
        }
      });
  }
  

  
}
