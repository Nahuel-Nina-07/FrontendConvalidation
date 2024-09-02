import { Component, Input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'shared-menu-title',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './menu-title.component.html',
  styleUrl: './menu-title.component.scss'
})
export class MenuTitleComponent {
 @Input() titleSystem!:string;
 @Input() detailTitleSystem!: string;
 @Input() iconTitleSystem!:string;
}
