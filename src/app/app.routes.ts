import { Routes } from '@angular/router';
import { MainHeaderComponent } from './features/main-layout/components/main-header/main-header.component';
import { MainLayoutComponent } from './features/main-layout/views/main-layout/main-layout.component';

export const routes: Routes = [
       {
        path: '', loadChildren: () => import('./features/main-layout/main.routes')
       }
];
