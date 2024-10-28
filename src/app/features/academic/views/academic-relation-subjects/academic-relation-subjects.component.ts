import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ListAllComponent } from "../../../../shared/components/list-all/list-all.component";
import { ModalFormComponent } from '../../../../shared/components/modals/modal-form/modal-form.component';
import { SuintButtonComponent } from "../../../../shared/components/suint-button/suint-button.component";
import { SuintPageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { InputCustomComponent } from "../../../../shared/components/custom-input/custom-input.component";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectOriginService } from '../../services/subject-origin.service';
import { CommonModule } from '@angular/common';
import { UniversityOriginService } from '../../services/university-origin.service';
import { AcademicSubjetRelationService } from '../../services/academic-subjet-relation.service';
import { AcademicUnitsService } from '../../services/academic-units.service';
import { AcademicSourceUnitService } from '../../services/academic-source-unit.service';
import jsPDF from 'jspdf';

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

  
  universitie: any = [];
  subjectsUAB: any[] = [];
  
  subjectList: any[] = [];
  filteredSubjectsUAB: any[] = [];

  subjectRelations: any[] = [];
  studentData: any = {};
  private subjectService = inject(SubjectOriginService);
  private universityService = inject(UniversityOriginService);
  private relationSubjectService = inject(AcademicSubjetRelationService);
  private unitService = inject(AcademicUnitsService);
  private sourceUnitService = inject(AcademicSourceUnitService);
  private router = inject(Router);

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

// Esta función se debe llamar cuando se presione un botón con el ID del objeto correspondiente
percentage(id: number): void {
    const relation = this.subjectRelations.find(relation => relation.id === id);
    if (relation) {
        console.log('Porcentaje de contenido para el ID', id, ':', relation.percentageContent);
    } else {
        console.log('No se encontró la relación con el ID proporcionado:', id);
    }
}


percentageIndividual(percentage: number): void {
  console.log('Porcentaje individual recibido:', percentage);
  // Aquí puedes hacer lo que necesites con el porcentaje
  // Por ejemplo, almacenarlo en una variable, mostrarlo en una alerta, etc.
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
      header: 'Comparacion y Reporte',
      buttons: [
        { name: 'Comparar', iconSrc: 'assets/icons/add-comparation.svg', action: this.convalidation.bind(this) },
        { name: 'Reporte', iconSrc: 'assets/icons/icon-printer.svg', action: this.getBySubjectId.bind(this) },
      ]
    }
  ];

  studentName = 'Nombre del estudiante';
  subjectFaculty = 'Nombre de la facultad';
  subjectCode = 'Código de la asignatura';
  subjectName = 'Nombre de la asignatura';
  originUniversityName = 'Nombre de la universidad de origen';
  facultyName = 'Nombre de la facultad de origen';
  code = 'Código de la asignatura de origen';
  sourceSubjectOriginName = 'Nombre de la asignatura de origen';

  getBySubjectId(item: any): void {
    console.log('Datos del sujeto:', item);
  
    if (item.percentageContent > 74) {
      // Generación del PDF
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(16);
      doc.text('INFORME TECNICO DE CONVALIDACION POR ASIGNATURA', 10, 10);
      doc.setFontSize(12);
      const studentName = this.studentData.name; // Obtener el nombre del estudiante
      doc.setFontSize(12);
      doc.text(`Estudiante: ${studentName}`, 10, 20);
      
      // Espacio entre el título y los cuadros
      doc.setLineWidth(0.5);
      doc.line(10, 25, 200, 25); // Línea de separación
      doc.text('Detalles de Asignatura', 10, 30);
      
      // Cuadro de la Universidad Adventista de Bolivia
      const startY = 40;
      const boxWidth = 190;
      const boxHeight = 50;
  
      // Dibuja el cuadro
      doc.rect(10, startY, boxWidth, boxHeight);
      doc.text('Universidad Adventista de Bolivia', 12, startY + 10);
      doc.text(`Facultad: ${this.subjectFaculty}`, 12, startY + 20);
      doc.text(`Código: ${this.subjectCode}`, 12, startY + 30);
      doc.text(`Asignatura: ${this.subjectName}`, 12, startY + 40);
      
      // Espacio para el siguiente cuadro
      const nextBoxY = startY + boxHeight + 10;
  
      // Cuadro de la Universidad de Origen
      doc.rect(10, nextBoxY, boxWidth, boxHeight);
      doc.text(this.originUniversityName, 12, nextBoxY + 10);
      doc.text(`Facultad: ${this.facultyName}`, 12, nextBoxY + 20);
      doc.text(`Código: ${this.code}`, 12, nextBoxY + 30);
      doc.text(`Asignatura: ${this.sourceSubjectOriginName}`, 12, nextBoxY + 40);
      
      // Finaliza el PDF
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    } else {
      // Mostrar un mensaje de error en el modal
      this.errorMessage = 'El porcentaje es menor o igual a 74. No se generará el PDF.';
      this.showErrorModal = true; // Mostrar el modal
    }
  }

  isOpen = false;
  errorMessage = ''; // Variable para almacenar el mensaje de error
  showErrorModal = false;

  convalidation(item: any) {
    const { id: relationSubjectsId, sourceSubjectOriginId, subjectId, sourceSubjectOriginName, subjectName } = item; // Extraemos el ID de subjectRelation
    
    this.unitService.getUnitBySubject(subjectId).subscribe(
      (unitData) => {
        const hasFewUnits = unitData.length < 5;
  
        this.sourceUnitService.getCareerByIdSubject(sourceSubjectOriginId).subscribe(
          (careerData) => {
            const hasFewCareers = careerData.length < 5;
  
            // Generar el mensaje de error según las condiciones
            if (hasFewUnits && hasFewCareers) {
              this.errorMessage = `${subjectName} y ${sourceSubjectOriginName} no tienen unidades suficientes para realizar la convalidación.`;
            } else if (hasFewUnits) {
              this.errorMessage = `${subjectName} no tiene unidades suficientes para realizar la convalidación.`;
            } else if (hasFewCareers) {
              this.errorMessage = `${sourceSubjectOriginName} no tiene unidades suficientes para realizar la convalidación.`;
            } else {
              // Si ambos tienen suficientes unidades, redirigir a la ruta
              this.router.navigate(['/academico/relation-units'], {
                queryParams: {
                  studentId: this.studentData.id,
                  sourceSubjectOriginId,
                  subjectId,
                  relationSubjectsId // Aquí se envía el ID de la relación de asignatura
                }
              });
              return;
            }
            this.showErrorModal = !!this.errorMessage;
          },
          (error) => console.error('Error al obtener carreras:', error)
        );
      },
      (error) => console.error('Error al obtener unidades:', error)
    );
  }  
  
  closeModal() {
    this.showErrorModal = false;
    this.errorMessage = '';
  }
}
