import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SuintPageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { InputCustomComponent } from "../../../../shared/components/custom-input/custom-input.component";
import { SuintButtonComponent } from "../../../../shared/components/suint-button/suint-button.component";
import { ModalFormComponent } from "../../../../shared/components/modals/modal-form/modal-form.component";
import { CommonModule } from '@angular/common';
import { ListAllComponent } from "../../../../shared/components/list-all/list-all.component";
import { SubjectOriginService } from '../../services/subject-origin.service';

@Component({
  selector: 'app-academic-subject-origin',
  standalone: true,
  imports: [SuintPageHeaderComponent, InputCustomComponent, SuintButtonComponent, ModalFormComponent, CommonModule, ListAllComponent],
  templateUrl: './academic-subject-origin.component.html',
  styleUrl: './academic-subject-origin.component.scss'
})
export class AcademicSubjectOriginComponent implements OnInit{
  ngOnInit(): void {
    this.getSubjects();
  }

  constructor(private subjectService: SubjectOriginService) {}

  subjects: any[] = [];
  @Input() data: any[] = [];
  @Input() columns: { header: string, field: string }[] = [];

  tableColumns = [
    { header: 'Nombre', field: 'name' },
    { header: '# Asig.', field: 'state' },
    { header: 'Teléfono', field: 'phone' },
    { header: 'Fecha de inicio', field: 'startDate' }
  ];

  @ViewChild('modal') modal!: ModalFormComponent;

  openAddModal() {
    this.modal.openModal();
  }

  getSubjects(): void {
    this.subjectService.getSubject().subscribe(
      (data: any[]) => {
        this.subjects = data;
      },
      (error) => {
        console.error('Error al obtener las universidades', error);
      }
    );
  }
}
