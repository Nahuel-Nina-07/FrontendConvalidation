import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { SuintPageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { ContratoService } from '../../../human-resources/services/contrato.service';
import { WorkAreaService } from '../../../human-resources/services/work-area.service';
import { DashboardService } from '../../../main-layout/services/dashboard.service';
import { ModalAddStudentComponent } from "../../../../shared/components/modals/modal-add-student/modal-add-student.component";
import { ModalServicesComponent } from "../../../../shared/components/modals/modal-services/modal-services.component";

@Component({
  selector: 'app-academic-convalidation-list',
  standalone: true,
  imports: [SvgIconComponent, SuintPageHeaderComponent, CommonModule, ModalAddStudentComponent, ModalServicesComponent],
  templateUrl: './academic-convalidation-list.component.html',
  styleUrl: './academic-convalidation-list.component.scss'
})
export class AcademicConvalidationListComponent {
  openForm( ){
    console.log('Me hicieron clic');
  }

  @Output() toggleMenu = new EventEmitter<void>();

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
