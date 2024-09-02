import { Component } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { MenuItemComponent } from '../../../../shared/components/menu-item/menu-item.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { MenuTitleComponent } from '../../../../shared/components/menu-title/menu-title.component';
import { SuintMainMenuComponent } from '../../../../shared/components/main-menu/main-menu.component';
import { MenuItemDataInterface } from '../../../../shared/components/main-menu/menu-item-data.interface.model';
import { MenuItemInterface } from '../../../../shared/components/main-menu/menu-item.interface.model';

@Component({
  selector: 'shared-menu-human-resources',
  standalone: true,
  imports: [
    HttpClientModule,
    SvgIconComponent,
    MenuItemComponent,
    MenuItemComponent,
    RouterLink,
    RouterLinkActive,
    MenuTitleComponent,
    SuintMainMenuComponent,
  ],
  templateUrl: './menu-human-resources.component.html',
  styleUrl: './menu-human-resources.component.scss',
})
export class MenuHumanResourceComponent {
  public titleMenu: string = 'CONFIGURACIONES';
  menuData = new Array<MenuItemDataInterface>();

  constructor() {
    this.menuData = [
        {
            title: 'PrimerItem',
            menuItems: [
                { icon: '', title: 'A', url: '' },
                { icon: '', title: 'B', url: '' }
            ]
        }
    ];
  }
}
