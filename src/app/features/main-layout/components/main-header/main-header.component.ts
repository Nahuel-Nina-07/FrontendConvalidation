import { Component, EventEmitter, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DashboardService } from '../../services/dashboard.service';
import { BtnNotificationComponent } from "../btn-notification/btn-notification.component";

@Component({
  selector: 'main-header',
  standalone: true,
  imports: [MainHeaderComponent, AngularSvgIconModule, BtnNotificationComponent],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss'
})
export class MainHeaderComponent {
  public institution: string = 'Universidad Adventista de Bolivia'
  public branch: string = 'Casa matriz';

  @Output() toggleMenu = new EventEmitter<void>();

  constructor(private dashboardService: DashboardService){}

  onToggleMenu(){
    this.toggleMenu.emit();
  }
}
