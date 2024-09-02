import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DashboardService } from '../../services/dashboard.service';
import { BtnNotificationComponent } from "../btn-notification/btn-notification.component";
import { ModalServicesComponent } from '../../../../shared/components/modals/modal-services/modal-services.component';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'main-header',
  standalone: true,
  imports: [
    AngularSvgIconModule, 
    BtnNotificationComponent, 
    ModalServicesComponent, 
    CommonModule, 
    NgClass
  ],
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent {
  public institution: string = 'Universidad Adventista de Bolivia'
  public branch: string = 'Casa matriz';

  @Output() toggleMenu = new EventEmitter<void>();

  constructor(private dashboardService: DashboardService){}

  public idDropDownServiceOpen: boolean = false;

  onToggleMenu(){
    this.toggleMenu.emit();
  }

  toggleDropdown(){
    this.idDropDownServiceOpen = !this.idDropDownServiceOpen;
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event: MouseEvent){
    const target = event.target as HTMLElement;

    // Asegúrate de que el click no fue en el botón del dropdown
    const clickedInsideDropdownButton = target.closest('.dropdown-button');
    const clickedInsideDropdownMenu = target.closest('.dropdown-menu');

    if (!clickedInsideDropdownButton && !clickedInsideDropdownMenu) {
      this.idDropDownServiceOpen = false;
    }
  }
}
