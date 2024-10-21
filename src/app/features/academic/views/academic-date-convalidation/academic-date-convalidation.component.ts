import { Component, ViewChild } from '@angular/core';
import { ModalFormComponent } from '../../../../shared/components/modals/modal-form/modal-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { SuintButtonComponent } from '../../../../shared/components/suint-button/suint-button.component';
import { InputCustomComponent } from "../../../../shared/components/custom-input/custom-input.component";

@Component({
  selector: 'app-academic-date-convalidation',
  standalone: true,
  imports: [ReactiveFormsModule, ModalFormComponent, SvgIconComponent, SuintButtonComponent, ModalFormComponent, InputCustomComponent],
  templateUrl: './academic-date-convalidation.component.html',
})
export class AcademicDateConvalidationComponent {


  @ViewChild('modal') modal!: ModalFormComponent;


  openAddModal() {
    this.modal.openModal();;
  }
}
