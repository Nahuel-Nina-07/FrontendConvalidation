import { Component } from '@angular/core';
import { MainHeaderComponent } from "../main-header/main-header.component";

@Component({
  selector: 'main-menu',
  standalone: true,
  imports: [MainHeaderComponent],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {

}
