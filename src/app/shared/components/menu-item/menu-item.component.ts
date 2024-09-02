import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'shared-menu-item',
  standalone: true,
  imports: [HttpClientModule, SvgIconComponent, RouterLink, RouterLinkActive],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
  @Input() nameMenuItem!:string;
  @Input() iconMenuItem!:string;
  @Input() route!:string;
}
