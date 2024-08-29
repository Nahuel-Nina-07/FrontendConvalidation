import { Routes } from '@angular/router';
import LayoutHumanResourceComponent from './views/human-resource-layout/human-resource-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutHumanResourceComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./views/human-resource-main/human-resource-main.component'),
      },
      {
        path: 'contract',
        loadComponent: () => import('./views/human-resource-contract/human-resource-contract.component'),
      },
      {
        path: 'structure',
        loadComponent: () => import('./views/human-resource-structure/human-resource-structure.component'),
      }            
    ],
  },
];

export default routes;
