import { Component} from '@angular/core';
import { menu_data } from './academic-menu-data';
import { SvgIconComponent } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SuintMainMenuComponent } from '../../../../shared/components/main-menu/main-menu.component';

@Component({
  selector: 'academic-layout',
  standalone: true,
  imports: [SvgIconComponent, CommonModule, RouterOutlet,  SuintMainMenuComponent],
  templateUrl: './academic-layout.component.html',
  styleUrl: './academic-layout.component.scss'
})
export class AcademicLayoutComponent{
  public menuData = menu_data;
  
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  prueba(){
    console.log('funciona');
    this.menuOpen = false;
  }
}

