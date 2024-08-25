import { HttpClientModule } from '@angular/common/http';
import { Component, Input, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';


@Component({
  selector: 'main-btn-system',
  standalone: true,
  imports: [HttpClientModule, SvgIconComponent, RouterLink],
  templateUrl: './btn-system.component.html',
  styleUrl: './btn-system.component.scss'
})
export class BtnSystemComponent {
  @Input() name!: string;
  @Input() icon!: string;
  @Input() route!: string;
}
