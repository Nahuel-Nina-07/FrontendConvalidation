import { Component, inject } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { InfoPanelComponent } from "../../../../shared/components/info-panel/info-panel.component";
import { ContratoService } from '../../services/contrato.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'human-resource-contract',
  standalone: true,
  imports: [SvgIconComponent, InfoPanelComponent,CommonModule],
  templateUrl: './human-resource-contract.component.html',
  styleUrl: './human-resource-contract.component.scss'
})
export default class HumanResourceContractComponent {

  
  private readonly contractSvc = inject(ContratoService)
  contract$ = this.contractSvc.getAllContracto()


  activarEvento(){
    console.log('Me hicieron clic');
  }

}
