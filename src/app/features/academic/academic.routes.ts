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
      {
        path: 'units-origin',
        loadComponent: () => import('./views/academic-source-unit/academic-source-unit.component').then(m => m.AcademicSourceUnitComponent),
      },
      {
        path: 'dates-report',
        loadComponent: () => import('./views/academic-date-convalidation/academic-date-convalidation.component').then(m => m.AcademicDateConvalidationComponent),
      },
      {
        path: 'student-enrollment',
        loadComponent: () => import('./views/academic-student-enrollment/academic-student-enrollment.component').then(m => m.AcademicStudentEnrollmentComponent),
      },
      {
        path: 'relation-subjects',
        loadComponent: () => import('./views/academic-relation-subjects/academic-relation-subjects.component').then(m => m.AcademicRelationSubjectsComponent),
      },
      {
        path: 'relation-units',
        loadComponent: () => import('./views/academic-units/academic-units.component').then(m => m.AcademicUnitsComponent),
      },
      {
        path: 'convalidatdos',
        loadComponent: () => import('./views/academic-convalidations/academic-convalidations.component').then(m => m.AcademicConvalidationsComponent),
      },
      {
        path: 'convalidatdos-subjects',
        loadComponent: () => import('./views/academic-convlaidacion-subject/academic-convlaidacion-subject.component').then(m => m.AcademicConvlaidacionSubjectComponent),
      },
      {
        path: 'LisStudents',
        loadComponent: () => import('./views/academic-list-students-homologation/academic-list-students-homologation.component').then(m => m.AcademicListStudentsHomologationComponent),
      },
      {
        path: 'LisAprovelSubjectsStudents',
        loadComponent: () => import('./views/subject-aprovates/subject-aprovates.component').then(m => m.SubjectAprovatesComponent),
      },
      {
        path: 'TableEquivalence',
        loadComponent: () => import('./views/homologation-table-equivalence/homologation-table-equivalence.component').then(m => m.HomologationTableEquivalenceComponent)
      },
    ],
  },
];

export default routes
