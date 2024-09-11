import { MenuItemInterface } from "../../../../shared/components/main-menu/menu-item.interface.model";


export const menu_data: Array<{ title: string, menuItems: MenuItemInterface[] }> = [
    {
        title: 'CONVALIDACION',
        menuItems: [
            { icon: 'assets/icons/icon-estructura.svg', title: 'Lista de convalidaciones', url: 'convalidation-list' },
            { icon: '/assets/icons/icon-empresa.svg', title: 'Editar asignatura', url: 'personal' },
            { icon: 'assets/icons/icon-contrato.svg', title: 'Replicar silabo', url: 'postulantes' },
            { icon: 'assets/icons/icon-estructura.svg', title: 'Universidades de Origen', url: 'university' },
            { icon: 'assets/icons/icon-contrato.svg', title: 'Carreras de Origen', url: 'career' },
            { icon: '/assets/icons/icon-empresa.svg', title: 'Convalidacion por asignatura', url: 'convalidationAsignature' }

        ],
    },
    {
        title: 'GESTION',
        menuItems: [
            { icon: 'assets/icons/icon-estructura.svg', title: 'Personal', url: 'personal' },
            { icon: 'assets/icons/icon-contrato.svg', title: 'Postulantes', url: 'postulantes' },
            { icon: 'assets/icons/icon-estructura.svg', title: 'Personal', url: 'personal' },
            { icon: 'assets/icons/icon-contrato.svg', title: 'Postulantes', url: 'postulantes' },
            { icon: 'assets/icons/icon-estructura.svg', title: 'Personal', url: 'personal' },
            { icon: 'assets/icons/icon-contrato.svg', title: 'Postulantes', url: 'postulantes' }
        ],
    }
    
];
