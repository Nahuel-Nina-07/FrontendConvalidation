import { Component, inject } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { SuintPageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { ContratoService } from '../../services/contrato.service';
import { CommonModule } from '@angular/common';
import { WorkAreaService } from '../../services/work-area.service';

@Component({
  selector: 'human-resource-contract',
  standalone: true,
  imports: [SvgIconComponent, SuintPageHeaderComponent, CommonModule],
  templateUrl: './human-resource-contract.component.html',
  styleUrl: './human-resource-contract.component.scss'
})
export default class HumanResourceContractComponent {

  
  private readonly contractSvc = inject(ContratoService)
  contract$ = this.contractSvc.getAllContracto()

  private readonly workArea = inject(WorkAreaService)
  workArea$ = this.workArea.getAllWorkArea()

  openForm( ){
    console.log('Me hicieron clic');
  }

}
