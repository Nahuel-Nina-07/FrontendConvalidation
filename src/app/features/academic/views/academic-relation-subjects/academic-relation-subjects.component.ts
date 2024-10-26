import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ListAllComponent } from "../../../../shared/components/list-all/list-all.component";
import { ModalFormComponent } from '../../../../shared/components/modals/modal-form/modal-form.component';
import { SuintButtonComponent } from "../../../../shared/components/suint-button/suint-button.component";
import { SuintPageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { InputCustomComponent } from "../../../../shared/components/custom-input/custom-input.component";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SubjectOriginService } from '../../services/subject-origin.service';
import { CommonModule } from '@angular/common';
import { UniversityOriginService } from '../../services/university-origin.service';
import { AcademicSubjetRelationService } from '../../services/academic-subjet-relation.service';

@Component({
  selector: 'app-academic-relation-subjects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ListAllComponent, SuintButtonComponent, SuintPageHeaderComponent, InputCustomComponent, ModalFormComponent],
  templateUrl: './academic-relation-subjects.component.html',
  styleUrl: './academic-relation-subjects.component.scss'
})
export class AcademicRelationSubjectsComponent implements OnInit {
  #_formBuilder = inject(FormBuilder);
  relationForm: FormGroup = this.#_formBuilder.group({
    searchDestino: new FormControl(''),
    searchOrigen: new FormControl(''),
    id: new FormControl(0),
    status: new FormControl(true),
    studentEnrollmentId: new FormControl(0),
    subjectId: new FormControl(null),
    date: new FormControl('2024-10-21T23:00:23.075Z'),
    percentajeContent: new FormControl(0),
    technicalId: new FormControl(1),
    sourceSubjectOriginId: new FormControl(null),
  });

  subjectList: any[] = [];
  universitie: any = [];
  subjectsUAB: any[] = [];
  filteredSubjectsUAB: any[] = [];
  subjectRelations: any[] = [];
  studentData: any = {};
  private subjectService = inject(SubjectOriginService);
  private universityService = inject(UniversityOriginService);
  private relationSubjectService = inject(AcademicSubjetRelationService);

  @ViewChild('modalDestino') modalDestino!: ModalFormComponent;
  @ViewChild('modalOrigen') modalOrigen!: ModalFormComponent;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.studentData = {
        id: params['id'],
        name: params['name'],
        originCareerId: params['originCareerId'],
        originUniversityId: params['originUniversityId']
      };

      const studentId = Number(this.studentData.id);
      this.relationForm.patchValue({ studentEnrollmentId: studentId });

      console.log('Datos del estudiante:', this.studentData);
      this.loadInitialData();
    });
  }
  

  private loadInitialData(): void {
    this.getSubjectsByCareer(this.studentData.originCareerId);
    this.getUniversityById(this.studentData.originUniversityId);
    this.loadSubject();
    this.getSubjectRelationByStudentEnrollment(this.studentData.id);
  }

  getSubjectRelationByStudentEnrollment(id: number): void {
    this.relationSubjectService.getSubjectRelationByStudentEmrollment(id).subscribe(
      (subjectRelation) => {
        this.subjectRelations = subjectRelation.map(relation => {
          const subjectDestino = this.subjectsUAB.find(subject => subject.id === relation.subjectId);
          const subjectOrigen = this.subjectList.find(subject => subject.id === relation.sourceSubjectOriginId);
          return {
            ...relation,
            subjectName: subjectDestino ? subjectDestino.subjectName : 'No asignada',
            sourceSubjectOriginName: subjectOrigen ? subjectOrigen.name : 'No asignada'
          };
        });
        console.log('Relación de asignaturas con nombres:', this.subjectRelations);
        this.updateFilteredSubjects();
      },
      (error) => {
        console.error('Error al obtener la relación de asignaturas:', error);
      }
    );
  }

  private updateFilteredSubjects(): void {
    const relatedSubjectIds = this.subjectRelations.map(relation => relation.subjectId);
    const relatedOriginIds = this.subjectRelations.map(relation => relation.sourceSubjectOriginId);
    this.filteredSubjectsUAB = this.subjectsUAB.filter(subject => !relatedSubjectIds.includes(subject.id));
    this.subjectList = this.subjectList.filter(subject => !relatedOriginIds.includes(subject.id));
    console.log('Asignaturas UAB actualizadas:', this.filteredSubjectsUAB);
    console.log('Lista de asignaturas de origen actualizada:', this.subjectList);
  }

  getUniversityById(id: number): void {
    this.universityService.getUniversityById(id).subscribe(
      (university) => {
        this.universitie = university;
        console.log('Universidad:', this.universitie);
      },
      (error) => {
        console.error('Error al obtener la universidad:', error);
      }
    );
  }

  getSubjectsByCareer(careerId: number): void {
    this.subjectService.getSubjectByCareer(careerId).subscribe(
      (subjects) => {
        this.subjectList = subjects.filter(subject => subject.status === true);
        const relatedOriginIds = this.subjectRelations.map(relation => relation.sourceSubjectOriginId);
        this.subjectList = this.subjectList.filter(subject => !relatedOriginIds.includes(subject.id));
        console.log('Asignaturas activas filtradas:', this.subjectList);
      },
      (error) => {
        console.error('Error al obtener las asignaturas:', error);
      }
    );
  }

  onSubmit() {
    if (this.relationForm.valid) {
      const formData = this.relationForm.value;
      console.log('Form data:', formData);
      this.relationSubjectService.createSubjectRelation(formData).subscribe({
        next: (response) => {
          console.log('Asignatura creada:', response);
          this.modalDestino.closeModal();
          this.modalOrigen.closeModal();
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

  filterSubjectsOrigen() {
    const searchValue = this.relationForm.get('searchOrigen')?.value.toLowerCase();
    if (searchValue) {
      this.subjectList = this.subjectList.filter(subject =>
        subject.name.toLowerCase().includes(searchValue) ||
        subject.code.toLowerCase().includes(searchValue) ||
        subject.semester.toString().includes(searchValue)
      );
    } else {
      this.getSubjectsByCareer(this.studentData.originCareerId);
    }
  }

  loadSubject() {
    this.subjectService.getSubjectsUAB().subscribe({
      next: (response) => {
        this.subjectsUAB = response;
        const relatedSubjectIds = this.subjectRelations.map(relation => relation.subjectId);
        this.filteredSubjectsUAB = this.subjectsUAB.filter(subject => !relatedSubjectIds.includes(subject.id));
        console.log('Asignaturas UAB filtradas:', this.filteredSubjectsUAB);
      },
      error: (error) => {
        console.error('Error al cargar las universidades:', error);
      }
    });
  }

  filterSubjectsUAB() {
    const searchValue = this.relationForm.get('searchDestino')?.value.toLowerCase();
    if (searchValue) {
      this.filteredSubjectsUAB = this.subjectsUAB.filter(subject =>
        subject.subjectName.toLowerCase().includes(searchValue)
      );
    } else {
      this.filteredSubjectsUAB = [...this.subjectsUAB];
    }
  }

  selectedDestinoId: number | null = null;  // ID de asignatura destino seleccionada
selectedOrigenId: number | null = null;   // ID de asignatura origen seleccionada

  selectedSubjectDestino(subject: any) {
    this.selectedDestinoId = subject.id;
    this.relationForm.patchValue({
      subjectId: subject.id,
    });
  }

  selectedSubjectOrigen(subject: any) {
    this.selectedOrigenId = subject.id; 
    this.relationForm.patchValue({
      sourceSubjectOriginId: subject.id,
    });
  }

  

  onDelete(item: any): void {
    const itemId = item.id;
    console.log('Delete item with ID:', itemId);
    this.relationSubjectService.deleteSubjectRelation(itemId).subscribe({
      next: (response) => {
        this.subjectRelations = this.subjectRelations.filter(u => u.id !== itemId);
        console.log('Item deleted successfully', response);
      },
      error: (error) => {
        console.error('Error deleting item', error);
      }
    });
  }

  openDestinoModal(item: any) {
    this.onSubmit();
    this.relationForm.patchValue(item);
    this.modalDestino.openModal();
    this.loadInitialData();
  }

  openOrigenModal(item: any) {
    this.relationForm.patchValue(item);
    this.modalOrigen.openModal();
    this.loadInitialData();
  }
  onEdit(item: any): void {
    this.relationForm.patchValue(item); 
  }

  tableColumns = [
    { header: 'Asignatura Destino', field: 'subjectName' },
    { header: 'Asignatura Origen', field: 'sourceSubjectOriginName' },
    { header: 'Porcentaje', field: 'percentageContent' },
  ];

  additionalColumns = [
    {
      header: 'Agregar asignaturas',
      buttons: [
        { name: 'Asignaturas Destino', iconSrc: 'assets/icons/add-comparation.svg', action: this.openDestinoModal.bind(this) },
        { name: 'Asignaturas Origen', iconSrc: 'assets/icons/add-destino.svg', action: this.openOrigenModal.bind(this) },
      ]
    },
    {
      header: 'Comparacion de Asignaturas',
      buttons: [
        { name: 'Comparar', iconSrc: 'assets/icons/add-comparation.svg', action: this.convalidation.bind(this) },
      ]
    }
  ];

  convalidation(item: any) {
    alert('No hay unidades en las materias');
  }

}
