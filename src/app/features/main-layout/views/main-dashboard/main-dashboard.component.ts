import { Component } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'main-dashboard',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.scss'
})
export default class MainDashboardComponent {

}
