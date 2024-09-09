import { Routes } from "@angular/router";
import { AcademicLayoutComponent } from './views/academic-layout/academic-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AcademicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./views/academic-main/academic-main.component').then(m => m.AcademicMainComponent),
      },
      {
        path: 'university',
        loadComponent: () => import('./views/academic-convalidation/academic-convalidation.component').then(m => m.AcademicConvalidationComponent),
      },
      {
        path: 'career',
        loadComponent: () => import('./views/academic-career-origin/academic-career-origin.component').then(m => m.CareerOriginComponent),
      },
      {
        path: 'listConvalidation',
        loadComponent: () => import('./views/academic-list-convalidation/academic-list-convalidation.component').then(m => m.AcademicListConvalidationComponent),
      },
      {
        path: 'convalidationAsignature',
        loadComponent: () => import('./views/academic-convalidation-asignature/academic-convalidation-asignature.component').then(m => m.AcademicConvalidationAsignatureComponent),
      }
    ],
  },
];

export default routes
