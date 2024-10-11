import { MenuItemInterface } from "../../../../shared/components/main-menu/menu-item.interface.model";


export const menu_data: Array<{ title: string, menuItems: MenuItemInterface[] }> = [
    {
        title: 'CONVALIDACION',
        menuItems: [
            { icon: 'assets/icons/icon-estructura.svg', title: 'Lista de convalidaciones', url: 'convalidation-list' },
            { icon: 'assets/icons/icon-estructura.svg', title: 'carrera origen ', url: 'career-origin' },
            { icon: '/assets/icons/icon-empresa.svg', title: 'Editar asignatura', url: 'personal' },
            { icon: 'assets/icons/icon-contrato.svg', title: 'Replicar silabo', url: 'postulantes' },
            { icon: 'assets/icons/icon-estructura.svg', title: 'Universidades de Origen', url: 'university' },
            { icon: 'assets/icons/icon-contrato.svg', title: 'Carreras de Origen', url: 'career' },
            { icon: '/assets/icons/icon-empresa.svg', title: 'Convalidacion por asignatura', url: 'convalidationAsignature' }

        ],
    },
    {
        title: 'Instituciones de Origen',
        menuItems: [
            { icon: 'assets/icons/icon-estructura.svg', title: 'Universidades', url: 'personal' },
            { icon: 'assets/icons/icon-contrato.svg', title: 'Carreras', url: 'postulantes' },
            { icon: 'assets/icons/icon-estructura.svg', title: 'Asignaturas', url: 'personal' },
        ],
    }
    
];
