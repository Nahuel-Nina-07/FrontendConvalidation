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
        path: 'university-origin',
        loadComponent: () => import('./views/academic-convalidation-list/academic-convalidation-list.component').then(m => m.AcademicConvalidationListComponent),
      },
      
      {
        path: 'career-origin',
        loadComponent: () => import('./views/academic-origin-career-convalidation/academic-origin-career-convalidation.component').then(m => m.AcademicOriginCareerConvalidationComponent),
      },
      {
        path: 'subjects-origin',
        loadComponent: () => import('./views/academic-subject-origin/academic-subject-origin.component').then(m => m.AcademicSubjectOriginComponent),
      },
    ],
  },
];

export default routes
