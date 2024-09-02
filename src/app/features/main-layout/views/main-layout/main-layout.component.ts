import { Component } from '@angular/core';
import { MainHeaderComponent } from '../../components/main-header/main-header.component';
import { MainMenuComponent } from '../../components/main-menu/main-menu.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import MainDashboardComponent from '../main-dashboard/main-dashboard.component';
import HumanMainLayoutComponent from '../../../human-resources/views/human-resource-layout/human-resource-layout.component';
import { ModalServicesComponent } from "../../../../shared/components/modals/modal-services/modal-services.component";


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [MainHeaderComponent, RouterOutlet, CommonModule, MainDashboardComponent, MainMenuComponent, HumanMainLayoutComponent, ModalServicesComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export default class MainLayoutComponent {
  menuOpen: boolean = true;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
