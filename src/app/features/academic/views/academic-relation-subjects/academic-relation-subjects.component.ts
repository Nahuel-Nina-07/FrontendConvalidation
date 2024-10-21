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
  destinoGroup: FormGroup;
  origenGroup: FormGroup;
  subjectList: any[] = [];
  universitie: any = [];
  subjectsUAB: any[] = []; // Lista de todas las unidades
  filteredSubjectsUAB: any[] = []; // Lista filtrada
  subjectRelations: any[] = [];
  private subjectService = inject(SubjectOriginService);
  private universityService = inject(UniversityOriginService);
  private relationSubjectService = inject(AcademicSubjetRelationService);

  constructor(private route: ActivatedRoute) {
    this.destinoGroup = this.createDestinoFormGroup();
    this.origenGroup = this.createOrigenFormGroup();
  }

  private createDestinoFormGroup(): FormGroup {
    return this.#_formBuilder.group({
      searchDestino: new FormControl('')
    });
  }

  private createOrigenFormGroup(): FormGroup {
    return this.#_formBuilder.group({
      searchOrigen: new FormControl('')
    });
  }

  @ViewChild('modalDestino') modalDestino!: ModalFormComponent;
  @ViewChild('modalOrigen') modalOrigen!: ModalFormComponent;

  openDestinoModal() {
    this.modalDestino.openModal();
  }

  openOrigenModal() {
    this.modalOrigen.openModal();
  }

  tableColumns = [
    { header: 'Asignatura Destino', field: 'subjectName' },
    { header: 'Asignatura Origen', field: 'sourceSubjectOriginName' },
    { header: 'Porcentaje', field: 'percentageContent' },
  ];

  additionalColumns = [
    {
      header: 'Unidades',
      buttons: [
        { name: 'Unidades', iconSrc: 'assets/icons/icon-unit.svg', action: this.downloadDocument.bind(this) },
      ]
    }
  ];

  downloadDocument(item: any) {
    console.log('Descargando documento para estudiante:', item);
  }

  onDelete(item: any): void {
    const itemId = item.id;
  }

  onSubmitDestino() {
    if (this.destinoGroup.valid) {
      const formData = this.destinoGroup.value;
      console.log('Destino Form data:', formData);
    }
  }

  onSubmitOrigen() {
    if (this.origenGroup.valid) {
      const formData = this.origenGroup.value;
      console.log('Origen Form data:', formData);
    }
  }

  studentData: any = {};

  ngOnInit(): void {
    // Obtener los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.studentData = {
        id: params['id'],
        name: params['name'],
        originCareerId: params['originCareerId'],
        originUniversityId: params['originUniversityId']
      };

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
        // Mapea las relaciones de asignaturas
        this.subjectRelations = subjectRelation.map(relation => {
          // Encuentra el nombre de la asignatura destino
          const subjectDestino = this.subjectsUAB.find(subject => subject.id === relation.subjectId);
          // Encuentra el nombre de la asignatura origen
          const subjectOrigen = this.subjectList.find(subject => subject.id === relation.sourceSubjectOriginId);
          
          return {
            ...relation,
            subjectName: subjectDestino ? subjectDestino.subjectName : 'No asignada', // Nombre de la asignatura destino
            sourceSubjectOriginName: subjectOrigen ? subjectOrigen.name : 'No asignada' // Nombre de la asignatura origen
          };
        });

        console.log('Relación de asignaturas con nombres:', this.subjectRelations); // Verifica el resultado mapeado
      },
      (error) => {
        console.error('Error al obtener la relación de asignaturas:', error);
      }
    );
}


  getUniversityById(id: number): void {
    this.universityService.getUniversityById(id).subscribe(
      (university) => {
        this.universitie = university;  // Guardar la universidad en la variable
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
        // Filtrar asignaturas que tienen el status en true
        this.subjectList = subjects.filter(subject => subject.status === true);
        console.log('Asignaturas activas:', this.subjectList);
      },
      (error) => {
        console.error('Error al obtener las asignaturas:', error);
      }
    );
  }

  filterSubjectsOrigen() {
    const searchValue = this.origenGroup.get('searchOrigen')?.value.toLowerCase();
    if (searchValue) {
      this.subjectList = this.subjectList.filter(subject =>
        subject.name.toLowerCase().includes(searchValue) ||
        subject.code.toLowerCase().includes(searchValue) ||
        subject.semester.toString().includes(searchValue) // Convertir semester a string si es un número
      );
    } else {
      // Si no hay valor de búsqueda, vuelve a cargar todas las asignaturas activas
      this.getSubjectsByCareer(this.studentData.originCareerId);
    }
  }

  loadSubject(){
    this.subjectService.getSubjectsUAB().subscribe({
      next: (response) => {
        this.subjectsUAB = response;
        this.filteredSubjectsUAB = response;  // Inicialmente, todas las universidades se muestran.
      },
      error: (error) => {
        console.error('Error al cargar las universidades:', error);
      }
    });
  }

  // Método para filtrar las unidades de la UAB
  filterSubjectsUAB() {
    const searchValue = this.destinoGroup.get('searchDestino')?.value.toLowerCase();  // Cambiado a destinoGroup
    if (searchValue) {
      this.filteredSubjectsUAB = this.subjectsUAB.filter(subject =>
        subject.subjectName.toLowerCase().includes(searchValue)
      );
    } else {
      this.filteredSubjectsUAB = [...this.subjectsUAB];  // Mostrar todas las unidades si no hay búsqueda
    }
  }
  
}
