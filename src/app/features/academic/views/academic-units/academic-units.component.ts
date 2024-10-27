import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StudentEnrollmentService } from '../../services/student-enrollment.service';
import { UniversityOriginService } from '../../services/university-origin.service';
import { CareerOrigin, SourceSubject, UniversityOrigin, Subject, SourceUnit, Units, UnitConvalidation } from './dataOrigin.model';
import { AcademicUnitsService } from '../../services/academic-units.service';
import { CommonModule } from '@angular/common';
import { SuintButtonComponent } from "../../../../shared/components/suint-button/suint-button.component";

@Component({
  selector: 'app-academic-units',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SuintButtonComponent],
  templateUrl: './academic-units.component.html',
  styleUrl: './academic-units.component.scss'
})
export class AcademicUnitsComponent implements OnInit {
  private originUniversityService = inject(UniversityOriginService);
  private studentEnrollmentService = inject(StudentEnrollmentService);
  private unitsService = inject(AcademicUnitsService);



  #_formBuilder: FormBuilder = inject(FormBuilder);
  relationForm: FormGroup = this.#_formBuilder.group({});

  //Estudiante
  studentId!: number;
  studentName!: string;
  //Universidad & Carrera de origen
  originCareerId!: number;
  originCareerName!: string;
  facultyName!: string;

  originUniversityId!: number;
  originUniversityName!: string;

  sourceSubjectOriginId!: number;
  sourceSubjectOriginName!: string;
  code!: string;

  subjeId!:number;
  subjectName!:string;
  subjectFaculty!:string;
  subjectCareer!:string;
  subjectCode!:string;

  //unitsOrigin
  sourceUnits: SourceUnit[] = []; 
  //units
  Units: Units[] = [];

  constructor(private route: ActivatedRoute) { 
    
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.studentId = params['studentId'];
      this.sourceSubjectOriginId = params['sourceSubjectOriginId'];
      this.subjeId= params['subjectId'];
      this.getStudentEnrollmentById(this.studentId);
      this.getSourceSubjectById(this.sourceSubjectOriginId);
      this.getSubjectById(this.subjeId);
    });
  }

  onSubmit() {
    
  }

  createUnitConvalidation(unit: any): FormGroup {
    return this.#_formBuilder.group({
      id: new FormControl(unit.id || 0),
      percentageContent: new FormControl(unit.percentageContent || 0),
      sourceUnitId: new FormControl(unit.sourceUnitId || ''),
      targetUnitId: new FormControl(unit.targetUnitId || ''),
      relationSubjectsId: new FormControl(unit.relationSubjectsId || ''),
    });
  }

  getStudentEnrollmentById(studentId: number) {
    this.studentEnrollmentService.getStudentEnrollmentById(studentId).subscribe(
      (studentData) => {
        this.studentName = studentData.name;
        this.originCareerId = studentData.originCareerId;
        this.originUniversityId = studentData.originUniversityId;
        console.log('Datos del estudiante:', studentData);
        this.getUniversityOriginById(this.originUniversityId);
        this.getCareerOriginById(this.originCareerId);
        this.getSourceUnitBySourceSubject(this.sourceSubjectOriginId);
        this.getUnitBySubject(this.subjeId);
      },
      (error) => {
        console.error('Error al obtener los datos del estudiante:', error);
      }
    );
  }

  getUniversityOriginById(originUniversityId: number) {
    this.originUniversityService.getUniversityById(originUniversityId).subscribe(
      (universityData: UniversityOrigin) => {
        this.originUniversityName = universityData.name;
        console.log('Datos de la universidad:', universityData);
      },
      (error) => {
        console.error('Error al obtener los datos de la universidad:', error);
      }
    );
  }

  getCareerOriginById(originCareerId: number) {
    this.unitsService.getCareerById(originCareerId).subscribe(
      (careerData: CareerOrigin) => {
        this.originCareerName = careerData.name;
        this.facultyName = careerData.facultyName;
        console.log('Datos de la universidad:', careerData);
      },
      (error) => {
        console.error('Error al obtener los datos de la universidad:', error);
      }
    );
  }

  getSourceSubjectById(sourceSubjectOriginId: number) {
    this.unitsService.getSourceSubjectById(sourceSubjectOriginId).subscribe(
      (sourceSubjectData:SourceSubject) => {
        this.sourceSubjectOriginName = sourceSubjectData.name;
        this.code = sourceSubjectData.code;
        console.log('Datos de la universidad:', sourceSubjectData);
      },
      (error) => {
        console.error('Error al obtener los datos de la universidad:', error);
      }
    );
  }

  getSubjectById(subjectId: number) {
    this.unitsService.getSubjectById(subjectId).subscribe(
      (subjectData:Subject) => {
        this.subjectName = subjectData.subjectName;
        this.subjectFaculty = subjectData.subjectFaculty;
        this.subjectCareer = subjectData.subjectCareer;
        this.subjectCode = subjectData.subjectCode;
        console.log('Datos de la universidad:', subjectData);
      },
      (error) => {
        console.error('Error al obtener los datos de la universidad:', error);
      }
    );
  }

  getSourceUnitBySourceSubject(sourceSubjectOriginId: number) {
    this.unitsService.getSourceUnitBySourceSubject(sourceSubjectOriginId).subscribe(
      (sourceUnitData: SourceUnit[]) => {
        // Ordenar por el campo `number`
        this.sourceUnits = sourceUnitData.sort((a, b) => a.number - b.number);
        console.log('Datos de la universidad ordenados por unidad:', this.sourceUnits);
      },
      (error) => {
        console.error('Error al obtener los datos de la universidad:', error);
      }
    );
  }

  getUnitBySubject(subjectId: number) {
    this.unitsService.getUnitBySubject(subjectId).subscribe(
      (unitData: Units[]) => {
        this.Units = unitData;
        console.log('Datos de la universidad:', this.Units);
      },
      (error) => {
        console.error('Error al obtener los datos de la universidad:', error);
      }
    );
  }
}
