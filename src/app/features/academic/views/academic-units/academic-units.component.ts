import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StudentEnrollmentService } from '../../services/student-enrollment.service';
import { UniversityOriginService } from '../../services/university-origin.service';
import { AcademicUnitsService } from '../../services/academic-units.service';
import { CommonModule } from '@angular/common';
import { SuintButtonComponent } from "../../../../shared/components/suint-button/suint-button.component";
import { CareerOrigin, SourceSubject, UniversityOrigin, Subject, SourceUnit, Units, UnitConvalidation } from './dataOrigin.model';

@Component({
  selector: 'app-academic-units',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SuintButtonComponent],
  templateUrl: './academic-units.component.html',
  styleUrls: ['./academic-units.component.scss']
})
export class AcademicUnitsComponent implements OnInit {
  private originUniversityService = inject(UniversityOriginService);
  private studentEnrollmentService = inject(StudentEnrollmentService);
  private unitsService = inject(AcademicUnitsService);
  private fb: FormBuilder = inject(FormBuilder);
  private route: ActivatedRoute = inject(ActivatedRoute);

  relationForm: FormGroup = this.fb.group({
    units: this.fb.array([]),
  });

  studentId!: number;
  studentName!: string;
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
  sourceUnits: SourceUnit[] = [];
  Units: Units[] = [];
  relationSubjectsId!: number;

  constructor() {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.studentId = params['studentId'];
      this.sourceSubjectOriginId = params['sourceSubjectOriginId'];
      this.subjeId = params['subjectId'];
      this.relationSubjectsId = params['relationSubjectsId'];

      this.loadInitialData();
    });
  }

  private loadInitialData() {
    this.getStudentEnrollmentById(this.studentId);
    this.getSourceSubjectById(this.sourceSubjectOriginId);
    this.getSubjectById(this.subjeId);
    this.getUnitConvalidationByRelationSubject(this.relationSubjectsId);
  }

  private createUnitGroup(unit: SourceUnit, unitDestino: Units, percentageContent: number = 0, unitConvalidationId: number = 0): FormGroup {
    return this.fb.group({
        sourceUnitId: [unit.id],
        targetUnitId: [unitDestino.id],
        percentageContent: [percentageContent, Validators.required],
        unitConvalidationId: [unitConvalidationId] // Incluye el ID de convalidación aquí
    });
}

private addUnitsToForm() {
  this.sourceUnits.forEach((unit, index) => {
      const unitDestino = this.Units[index];
      const unitConvalidation = this.unitConvalidationData.find(uc => uc.sourceUnitId === unit.id && uc.targetUnitId === unitDestino?.id);

      if (unitDestino) {
          const percentageContent = unitConvalidation ? unitConvalidation.percentageContent : 0;
          const unitConvalidationId = unitConvalidation ? unitConvalidation.id : 0;
          this.units.push(this.createUnitGroup(unit, unitDestino, percentageContent, unitConvalidationId));
      }
  });
}

  private getPercentageContent(sourceUnitId: number): number {
    const unitConvalidation = this.unitConvalidationData.find(u => u.sourceUnitId === sourceUnitId);
    return unitConvalidation ? unitConvalidation.percentageContent : 0; // Retornar el porcentaje si se encuentra, de lo contrario 0
  }

  private addUnitsDestinoToForm() {
    this.Units.forEach((unitDestino, index) => {
      const unit = this.sourceUnits[index];
      if (unit) {
        const percentageContent = this.getPercentageContent(unit.id); // Obtener el porcentaje basado en el ID
        this.units.push(this.createUnitGroup(unit, unitDestino, percentageContent));
      }
    });
  }

  get units(): FormArray {
    return this.relationForm.get('units') as FormArray || this.fb.array([]);
  }
  

  onSubmit() {
    const unitConvalidations: UnitConvalidation[] = this.units.controls.map(control => ({
      id: control.get('unitConvalidationId')?.value || 0, 
      percentageContent: control.get('percentageContent')?.value || 0,
      sourceUnitId: control.get('sourceUnitId')?.value,
      targetUnitId: control.get('targetUnitId')?.value,
      relationSubjectsId: this.relationSubjectsId
    }));

    unitConvalidations.forEach(unit => {
      console.log('Datos que se enviarán para crear la convalidación de unidades:', unitConvalidations);
      // this.unitsService.createUnitConvalidation(unit).subscribe(
      //   response => console.log('Unit convalidation created successfully:', response),
      //   error => console.error('Error creating unit convalidation:', error)
      // );
    });
  }

  private getStudentEnrollmentById(studentId: number) {
    this.studentEnrollmentService.getStudentEnrollmentById(studentId).subscribe(
      studentData => {
        this.studentName = studentData.name;
        this.originCareerId = studentData.originCareerId;
        this.originUniversityId = studentData.originUniversityId;

        this.getUniversityOriginById(this.originUniversityId);
        this.getCareerOriginById(this.originCareerId);
        this.getSourceUnitBySourceSubject(this.sourceSubjectOriginId);
        this.getUnitBySubject(this.subjeId);
      },
      error => console.error('Error fetching student data:', error)
    );
  }

  private getUniversityOriginById(originUniversityId: number) {
    this.originUniversityService.getUniversityById(originUniversityId).subscribe(
      universityData => {
        this.originUniversityName = universityData.name;
        console.log('University data:', universityData);
      },
      error => console.error('Error fetching university data:', error)
    );
  }

  private getCareerOriginById(originCareerId: number) {
    this.unitsService.getCareerById(originCareerId).subscribe(
      careerData => {
        this.originCareerName = careerData.name;
        this.facultyName = careerData.facultyName;
        console.log('Career data:', careerData);
      },
      error => console.error('Error fetching career data:', error)
    );
  }

  private getSourceSubjectById(sourceSubjectOriginId: number) {
    this.unitsService.getSourceSubjectById(sourceSubjectOriginId).subscribe(
      sourceSubjectData => {
        this.sourceSubjectOriginName = sourceSubjectData.name;
        this.code = sourceSubjectData.code;
        console.log('Source subject data:', sourceSubjectData);
      },
      error => console.error('Error fetching source subject data:', error)
    );
  }

  private getSubjectById(subjectId: number) {
    this.unitsService.getSubjectById(subjectId).subscribe(
      subjectData => {
        this.subjectName = subjectData.subjectName;
        this.subjectFaculty = subjectData.subjectFaculty;
        this.subjectCareer = subjectData.subjectCareer;
        this.subjectCode = subjectData.subjectCode;
        console.log('Subject data:', subjectData);
      },
      error => console.error('Error fetching subject data:', error)
    );
  }

  private getSourceUnitBySourceSubject(sourceSubjectOriginId: number) {
    this.unitsService.getSourceUnitBySourceSubject(sourceSubjectOriginId).subscribe(
      sourceUnitData => {
        this.sourceUnits = sourceUnitData.sort((a, b) => a.number - b.number);
        console.log('Sorted source units:', this.sourceUnits);
        this.addUnitsToForm();
      },
      error => console.error('Error fetching source units:', error)
    );
  }

  private getUnitBySubject(subjectId: number) {
    this.unitsService.getUnitBySubject(subjectId).subscribe(
      unitData => {
        this.Units = unitData.sort((a, b) => a.number - b.number);
        console.log('Sorted units:', this.Units);
        this.addUnitsDestinoToForm();
      },
      error => console.error('Error fetching units:', error)
    );
  }

  unitConvalidationData: UnitConvalidation[] = [];

  getUnitConvalidationByRelationSubject(relationSubjectsId: number) { 
    this.unitsService.getUnitConvalidationByRelationSubject(relationSubjectsId).subscribe(
      (data: UnitConvalidation[]) => {
        this.unitConvalidationData = data;
        console.log('Unit convalidation data:', this.unitConvalidationData);
      },
      error => console.error('Error fetching unit convalidation data:', error)
    );
  }
  
}
