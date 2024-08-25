import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainMenuComponent } from "./features/main-layout/components/main-menu/main-menu.component";
import { MainHeaderComponent } from './features/main-layout/components/main-header/main-header.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainHeaderComponent, MainMenuComponent, HttpClientModule, SvgIconComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SUINT-Hub';
}
