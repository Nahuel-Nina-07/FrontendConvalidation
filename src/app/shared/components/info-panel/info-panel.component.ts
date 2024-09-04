import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'shared-info-panel',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './info-panel.component.html',
  styleUrl: './info-panel.component.scss'
})
export class InfoPanelComponent {
 @Input() infoTitle!: string;
 @Input() infoDetail!: string;

 @Output() clicked = new EventEmitter<void>();

 onclicked(){
  this.clicked.emit();
 }

}
