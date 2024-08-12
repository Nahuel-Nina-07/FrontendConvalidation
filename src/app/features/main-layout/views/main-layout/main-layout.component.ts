import { Component } from '@angular/core';
import { MainHeaderComponent } from "../../components/main-header/main-header.component";
import { MainMenuComponent } from "../../components/main-menu/main-menu.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [MainHeaderComponent, MainMenuComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
