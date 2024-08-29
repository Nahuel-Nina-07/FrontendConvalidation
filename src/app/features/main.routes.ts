import { Routes } from "@angular/router";
import MainLayoutComponent from "./main-layout/views/main-layout/main-layout.component";


export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children:[
            {
                path: 'home',
                loadComponent:() => import('./main-layout/views/main-dashboard/main-dashboard.component')
            },
            {
                path: 'rh', loadChildren: () => import('./human-resources/human-resources.routes')
             }
             ,
            {
                path: 'academico', loadChildren: () => import('./academic/academic.routes')
             }
        ]
    }
]

export default routes
