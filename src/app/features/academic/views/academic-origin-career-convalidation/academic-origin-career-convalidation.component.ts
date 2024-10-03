import { Component, inject } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { SuintPageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import { ModalFormComponent } from '../../../../shared/components/modals/modal-form/modal-form.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputCustomComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { ContratoService } from '../../../human-resources/services/contrato.service';
import { WorkAreaService } from '../../../human-resources/services/work-area.service';

@Component({
  selector: 'app-academic-origin-career-convalidation',
  standalone: true,
  imports: [SvgIconComponent, SuintPageHeaderComponent, CommonModule, ModalFormComponent, ReactiveFormsModule, InputCustomComponent],
  templateUrl: './academic-origin-career-convalidation.component.html',
  styleUrl: './academic-origin-career-convalidation.component.scss'
})
export class AcademicOriginCareerConvalidationComponent {

  #_formBuilder = inject(FormBuilder)

  
  private readonly contractSvc = inject(ContratoService)
  contract$ = this.contractSvc.getAllContracto()

  private readonly workArea = inject(WorkAreaService)
  workArea$ = this.workArea.getAllWorkArea()
  
  contractGroup = new FormGroup({
    namecontract: new FormControl('hola')
  })

  register(){
    console.log(this.contractGroup.get('namecontract')?.value);
    
  }
}
