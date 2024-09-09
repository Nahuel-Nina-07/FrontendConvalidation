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
      }
    ],
  },
];

export default routes
