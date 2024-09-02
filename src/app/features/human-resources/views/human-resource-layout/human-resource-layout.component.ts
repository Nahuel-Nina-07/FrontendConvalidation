import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLinkActive, RouterOutlet } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { MenuHumanResourceComponent } from "../../components/menu-human-resources/menu-human-resources.component";
import { SuintMainMenuComponent } from '../../../../shared/components/main-menu/main-menu.component';
import { menu_data } from './menu-data';

@Component({
  selector: 'human-main-layout',
  standalone: true,
  imports: [SvgIconComponent, CommonModule, RouterOutlet, MenuHumanResourceComponent, SuintMainMenuComponent],
  templateUrl: './human-resource-layout.component.html',
  styleUrls: ['./human-resource-layout.component.scss']
})
export default class HumanResourceLayoutComponent {
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
