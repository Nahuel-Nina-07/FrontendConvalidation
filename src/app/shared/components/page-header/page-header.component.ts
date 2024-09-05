import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'suint-page-header',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './page-header.component.html'
})
export class SuintPageHeaderComponent {
 @Input() title = '';
 @Input() description = '';

 @Output() onClickButton = new EventEmitter<void>();

 clickButton(){
  this.onClickButton.emit();
 }

}
