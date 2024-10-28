import { Component, OnInit } from '@angular/core';
import { AcademicSubjetRelationService } from '../../services/academic-subjet-relation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentEnrollmentService } from '../../services/student-enrollment.service';
import { SubjectOriginService } from '../../services/subject-origin.service';

@Component({
  selector: 'app-academic-convalidations',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './academic-convalidations.component.html',
  styleUrl: './academic-convalidations.component.scss'
})
export class AcademicConvalidationsComponent implements OnInit {
  subjectRelations: any[] = [];
  filteredRelations: any[] = [];
  studentNames: { [key: number]: string } = {};
  subjectNames: { [key: number]: string } = {}; // Mapa para almacenar nombres de asignaturas

  constructor(
    private subjectRelationService: AcademicSubjetRelationService,
    private studentEnrollmentService: StudentEnrollmentService,
    private subjectOriginService: SubjectOriginService // Inyecta el servicio
  ) {}

  ngOnInit(): void {
    this.getSubjectRelations();
  }

  getSubjectRelations(): void {
    this.subjectRelationService.getSubjectRelation().subscribe(
      (data) => {
        this.subjectRelations = data;
        this.filteredRelations = this.subjectRelations.filter(relation => relation.percentageContent > 74);
        this.getStudentNames(); // Obtener nombres de estudiantes
        this.getSubjectNames(); // Obtener nombres de asignaturas
      },
      (error) => {
        console.error('Error fetching subject relations:', error);
      }
    );
  }

  getStudentNames(): void {
    const studentIds = Array.from(new Set(this.filteredRelations.map(relation => relation.studentEnrollmentId)));
    
    studentIds.forEach(id => {
      this.studentEnrollmentService.getStudentEnrollmentById(id).subscribe(
        (student) => {
          this.studentNames[id] = student.name;
        },
        (error) => {
          console.error('Error fetching student name for ID:', id, error);
        }
      );
    });
  }

  getSubjectNames(): void {
    const subjectIds = Array.from(new Set(this.filteredRelations.map(relation => relation.subjectId)));

    subjectIds.forEach(id => {
      this.subjectOriginService.getSubjectById(id).subscribe(
        (subject) => {
          this.subjectNames[id] = subject.name; // Asignar el nombre al ID correspondiente
        },
        (error) => {
          console.error('Error fetching subject name for ID:', id, error);
        }
      );
    });
  }
}

