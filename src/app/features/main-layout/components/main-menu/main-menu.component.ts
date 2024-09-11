import { Component } from '@angular/core';
import { BtnSystemComponent } from "../btn-system/btn-system.component";
import { HttpClientModule } from '@angular/common/http';
import { SvgIconComponent } from 'angular-svg-icon';
import { Feature } from '../../models/features';

@Component({
  selector: 'main-menu',
  standalone: true,
  imports: [BtnSystemComponent, HttpClientModule, SvgIconComponent],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {

  public features: Feature[]=[
    {
      name: 'Inicio',
      icon: '/assets/icons/icon-home.svg',
      route: 'home'
    },
    {
      name: 'Configuraciones',
      icon: '/assets/icons/icon-config.svg',
      route: '/Config'
    },
    { 
      name: 'Secretaria General',
      icon: '/assets/icons/icon-secre.svg',
      route: '/secgral'
      
    },
    {
      name: 'Recursos Humanos',
      icon: '/assets/icons/icon-rh.svg',
      route: 'rh'
    },
    {
      name: 'Academico',
      icon: '/assets/icons/icon-academico.svg',
      route: '/academico'
    },
    {
      name: 'Financiero',
      icon: '/assets/icons/icon-financiero.svg',
      route: '/contrataciones'
    },
    {
      name: 'Gestion de calidad',
      icon: '/assets/icons/icon-reclamos.svg',
      route: '/sgc'
    },
    {
      name: 'Comendor',
      icon: '/assets/icons/icon-comedor.svg',
      route: '/comedor'
    },
    {
      name: 'UAB-Class',
      icon: '/assets/icons/icon-uabClass.svg',
      route: '/class'
    },
    {
      name: 'Almacenes',
      icon: '/assets/icons/icon-almacenes.svg',
      route: '/almacenes'
    },
    {
      name: 'Acreditación',
      icon: '/assets/icons/icon-acreditacion.svg',
      route: '/acreditacion'
    },
    {
      name: 'Pagina Web',
      icon: '/assets/icons/icon-web.svg',
      route: '/web'
    },
    {
      name: 'Solicitudes internas',
      icon: '/assets/icons/icon-solicitudes.svg',
      route: '/solicitudes'
    },
    {
      name: 'Contrataciones',
      icon: '/assets/icons/icon-contrataciones.svg',
      route: '/contrataciones'
    },
    {
      name: 'Convalidacion Homologacion',
      icon: '/assets/icons/icon-homologacion.svg',
      route: '/convalidaciones'
    }
  ]
}
