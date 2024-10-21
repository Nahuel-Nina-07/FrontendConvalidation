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
      searchOrigen: new FormControl(''),
      
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
  
  

  onSubmitDestino() {
    // Verificar si hay alguna relación existente con `subjectId` o `sourceSubjectOriginId` en null
    const incompleteRelation = this.subjectRelations.find(
      (relation) => relation.sourceSubjectOriginId === null
    );
  
    if (incompleteRelation) {
      // Mostrar mensaje de advertencia
      console.warn('No puedes agregar una asignatura de destino hasta que completes las asignaturas de origen.');
      alert('No puedes agregar una asignatura de destino hasta que completes las asignaturas de origen.');
      return;
    }
  
    if (this.destinoGroup.valid && this.selectedSubject) {
      const formData = {
        id: 0,
        status: true,
        studentEnrollmentId: this.studentData.id,
        subjectId: this.selectedSubject.id,
        date: "2024-10-21T03:01:46.199Z",
        percentajeContent: 0,
        technicalId: 0,
        sourceSubjectOriginId: null
      };
      console.log('Destino Form data:', formData);
  
      this.relationSubjectService.createSubjectRelation(formData).subscribe(
        response => {
          console.log('Relación de asignatura creada:', response);
          // Recargar la lista de relaciones
          this.getSubjectRelationByStudentEnrollment(this.studentData.id);
        },
        error => {
          console.error('Error al crear la relación de asignatura:', error);
        }
      );
    } else {
      console.warn('No se ha seleccionado ninguna asignatura.');
    }
  }
  
  onSubmitOrigen() {
    // Verificar si hay alguna relación existente con `subjectId` o `sourceSubjectOriginId` en null
    const incompleteRelation = this.subjectRelations.find(
      (relation) => relation.subjectId === null
    );
  
    if (incompleteRelation) {
      // Mostrar mensaje de advertencia
      console.warn('No puedes agregar una asignatura de origen hasta que completes las asignaturas de destino.');
      alert('No puedes agregar una asignatura de origen hasta que completes las asignaturas de destino.');
      return;
    }
  
    if (this.origenGroup.valid && this.selectedSubject) {
      const formData = {
        id: 0,
        status: true,
        studentEnrollmentId: this.studentData.id,
        subjectId: null,
        date: "2024-10-21T03:01:46.199Z",
        percentajeContent: 0,
        technicalId: 0,
        sourceSubjectOriginId: this.selectedSubject.id  // 'selectedSubject' es la asignatura de origen
      };
      console.log('Origen Form data:', formData);
  
      this.relationSubjectService.createSubjectRelation(formData).subscribe(
        response => {
          console.log('Relación de asignatura creada:', response);
          // Recargar la lista de relaciones
          this.getSubjectRelationByStudentEnrollment(this.studentData.id);
        },
        error => {
          console.error('Error al crear la relación de asignatura:', error);
        }
      );
    } else {
      console.warn('No se ha seleccionado ninguna asignatura.');
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
          const subjectDestino = this.subjectsUAB.find(subject => subject.id === relation.subjectId);
          const subjectOrigen = this.subjectList.find(subject => subject.id === relation.sourceSubjectOriginId);

          return {
            ...relation,
            subjectName: subjectDestino ? subjectDestino.subjectName : 'No asignada',
            sourceSubjectOriginName: subjectOrigen ? subjectOrigen.name : 'No asignada'
          };
        });

        console.log('Relación de asignaturas con nombres:', this.subjectRelations);

        // Filtrar subjectsUAB y subjectList después de obtener las relaciones
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

  // Filtrar asignaturas que ya están en las relaciones existentes
  this.filteredSubjectsUAB = this.subjectsUAB.filter(subject => !relatedSubjectIds.includes(subject.id));
  this.subjectList = this.subjectList.filter(subject => !relatedOriginIds.includes(subject.id));

  console.log('Asignaturas UAB actualizadas:', this.filteredSubjectsUAB);
  console.log('Lista de asignaturas de origen actualizada:', this.subjectList);
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
        // Filtrar asignaturas activas (status true)
        this.subjectList = subjects.filter(subject => subject.status === true);

        // Filtrar asignaturas que ya están en subjectRelations
        const relatedOriginIds = this.subjectRelations.map(relation => relation.sourceSubjectOriginId);
        
        // Filtrar asignaturas activas que no están en las relaciones existentes
        this.subjectList = this.subjectList.filter(subject => !relatedOriginIds.includes(subject.id));

        console.log('Asignaturas activas filtradas:', this.subjectList);
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

  loadSubject() {
    this.subjectService.getSubjectsUAB().subscribe({
      next: (response) => {
        this.subjectsUAB = response;

        // Filtrar asignaturas que ya están en subjectRelations
        const relatedSubjectIds = this.subjectRelations.map(relation => relation.subjectId);

        // Filtrar asignaturas que no están en las relaciones existentes
        this.filteredSubjectsUAB = this.subjectsUAB.filter(subject => !relatedSubjectIds.includes(subject.id));

        console.log('Asignaturas UAB filtradas:', this.filteredSubjectsUAB);
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
  
  selectedSubject: any;

onSelectSubject(subject: any) {
  this.selectedSubject = subject;
  console.log('Asignatura seleccionada:', this.selectedSubject);
}


}
