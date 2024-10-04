import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { SuintButtonComponent } from "../suint-button/suint-button.component";

@Component({
  selector: 'suint-page-header',
  standalone: true,
  imports: [SvgIconComponent, SuintButtonComponent],
  templateUrl: './page-header.component.html'
})
export class SuintPageHeaderComponent {
 @Input() title = '';
 @Input() description = '';

}
