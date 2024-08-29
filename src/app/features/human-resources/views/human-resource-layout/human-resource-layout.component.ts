import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { MenuHumanResourceComponent } from "../../components/menu-human-resources/menu-human-resources.component";

@Component({
  selector: 'human-main-layout',
  standalone: true,
  imports: [SvgIconComponent, CommonModule, RouterOutlet, MenuHumanResourceComponent],
  templateUrl: './human-resource-layout.component.html',
  styleUrls: ['./human-resource-layout.component.scss']
})
export default class HumanResourceLayoutComponent {
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
