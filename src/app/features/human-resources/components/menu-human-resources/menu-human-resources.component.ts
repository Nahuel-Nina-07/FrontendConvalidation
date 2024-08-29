import { Component } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { MenuItemComponent } from "../../../../shared/components/menu-item/menu-item.component";
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { MenuTitleComponent } from "../../../../shared/components/menu-title/menu-title.component";


@Component({
  selector: 'shared-menu-human-resources',
  standalone: true,
  imports: [HttpClientModule, SvgIconComponent, MenuItemComponent, MenuItemComponent, RouterLink, RouterLinkActive, MenuTitleComponent ],
  templateUrl: './menu-human-resources.component.html',
  styleUrl: './menu-human-resources.component.scss'
})
export class MenuHumanResourceComponent {

 public titleMenu: string = 'CONFIGURACIONES'
}
