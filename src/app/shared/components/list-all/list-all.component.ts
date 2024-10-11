import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'suint-list-all',
  standalone: true,
  imports: [CommonModule,SvgIconComponent],
  templateUrl: './list-all.component.html'
})
export class ListAllComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  

}
