import { Component, Input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { MenuItemDataInterface } from './menu-item-data.interface.model';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'suint-main-menu',
  templateUrl: './main-menu.component.html',
  standalone: true,
  imports: [SvgIconComponent, RouterLink, RouterLinkActive]
})
export class SuintMainMenuComponent {
  @Input() MenuTitle = '';
  @Input() MenuIcon =  '';
  @Input() MenuDescription = '';
  @Input() MenuData = new Array<MenuItemDataInterface>();
}
