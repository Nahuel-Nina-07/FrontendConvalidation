import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  relationForm: FormGroup;

  // Estudiante
  studentId!: number;
  studentName!: string;
  
  // Universidad & Carrera de origen
  originCareerId!: number;
  originCareerName!: string;
  facultyName!: string;

  originUniversityId!: number;
  originUniversityName!: string;

  sourceSubjectOriginId!: number;
  sourceSubjectOriginName!: string;
  code!: string;

  subjeId!: number;
  subjectName!: string;
  subjectFaculty!: string;
  subjectCareer!: string;
  subjectCode!: string;

  // unitsOrigin
  sourceUnits: SourceUnit[] = [];
  // units
  Units: Units[] = [];
  //subjectid
  relationSubjectsId!: number;

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.relationForm = this.fb.group({
      units: this.fb.array([]),
    });
  }

  get units(): FormArray {
    return this.relationForm.get('units') as FormArray; 
  }

  private createUnitGroup(unit: SourceUnit,unitdestino:Units): FormGroup {
    return this.#_formBuilder.group({
      sourceUnitId: [unit.id], 
      targetUnitId: [unitdestino.id],
      percentageContent: [0, Validators.required]
    });
  }

  addUnitsToForm() {
    this.sourceUnits.forEach((unit, index) => {
      const unitdestino = this.Units[index];
      if (unitdestino) {
        this.units.push(this.createUnitGroup(unit, unitdestino));
      }
    });
  }

  addUnitsDestinoToForm() {
    this.Units.forEach((unitdestino, index) => {
      const unit = this.sourceUnits[index];
      if (unit) {
        this.units.push(this.createUnitGroup(unit, unitdestino)); // Pass both units
      }
    });
  }
  

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.studentId = params['studentId'];
      this.sourceSubjectOriginId = params['sourceSubjectOriginId'];
      this.subjeId = params['subjectId'];
      this.relationSubjectsId = params['relationSubjectsId'];      
      this.getStudentEnrollmentById(this.studentId);
      this.getSourceSubjectById(this.sourceSubjectOriginId);
      this.getSubjectById(this.subjeId);
    });
  }

  onSubmit() {
    const unitsArray = this.relationForm.get('units') as FormArray; // Cast to FormArray
    const unitConvalidations: UnitConvalidation[] = unitsArray.controls.map((control) => {
        return {
            id: 0,
            percentageContent: control.get('percentageContent')?.value || 0,
            sourceUnitId: control.get('sourceUnitId')?.value,
            targetUnitId: control.get('targetUnitId')?.value,
            relationSubjectsId: this.relationSubjectsId
        } as UnitConvalidation;
    });
    unitConvalidations.forEach((unit) => {
        this.unitsService.createUnitConvalidation(unit).subscribe(
            response => {
                console.log('Unit convalidation created successfully:', response);
            },
            error => {
                console.error('Error creating unit convalidation:', error);
            }
        );
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
        console.log('Datos de la carrera:', careerData);
      },
      (error) => {
        console.error('Error al obtener los datos de la carrera:', error);
      }
    );
  }

  getSourceSubjectById(sourceSubjectOriginId: number) {
    this.unitsService.getSourceSubjectById(sourceSubjectOriginId).subscribe(
      (sourceSubjectData: SourceSubject) => {
        this.sourceSubjectOriginName = sourceSubjectData.name;
        this.code = sourceSubjectData.code;
        console.log('Datos del tema:', sourceSubjectData);
      },
      (error) => {
        console.error('Error al obtener los datos del tema:', error);
      }
    );
  }

  getSubjectById(subjectId: number) {
    this.unitsService.getSubjectById(subjectId).subscribe(
      (subjectData: Subject) => {
        this.subjectName = subjectData.subjectName;
        this.subjectFaculty = subjectData.subjectFaculty;
        this.subjectCareer = subjectData.subjectCareer;
        this.subjectCode = subjectData.subjectCode;
        console.log('Datos de la asignatura:', subjectData);
      },
      (error) => {
        console.error('Error al obtener los datos de la asignatura:', error);
      }
    );
  }

  getSourceUnitBySourceSubject(sourceSubjectOriginId: number) {
    this.unitsService.getSourceUnitBySourceSubject(sourceSubjectOriginId).subscribe(
      (sourceUnitData: SourceUnit[]) => {
        this.sourceUnits = sourceUnitData.sort((a, b) => a.number - b.number);
        console.log('Datos de las unidades ordenadas por número:', this.sourceUnits);
        this.addUnitsToForm();
      },
      (error) => {
        console.error('Error al obtener las unidades de la materia:', error);
      }
    );
  }

  getUnitBySubject(subjectId: number) {
    this.unitsService.getUnitBySubject(subjectId).subscribe(
      (unitData: Units[]) => {
        this.Units = unitData.sort((a, b) => a.number - b.number);
        console.log('Datos de las unidades ordenados:', this.Units);
        this.addUnitsDestinoToForm()
      },
      (error) => {
        console.error('Error al obtener los datos de las unidades:', error);
      }
    );
  }
}
