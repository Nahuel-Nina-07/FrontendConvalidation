import { Component, Input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'main-btn-notification',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './btn-notification.component.html',
  styleUrl: './btn-notification.component.scss'
})
export class BtnNotificationComponent {

  @Input() number!:string;
  @Input() icon!:string

}
