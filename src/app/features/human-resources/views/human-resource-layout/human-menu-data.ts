import { MenuItemInterface } from "../../../../shared/components/main-menu/menu-item.interface.model";


export const menu_data: Array<{ title: string, menuItems: MenuItemInterface[] }> = [
    {
        title: 'CONFIGURACIONES',
        menuItems: [
            { icon: 'assets/icons/icon-estructura.svg', title: 'Estructura organizacional', url: 'structure' },
            { icon: 'assets/icons/icon-contrato.svg', title: 'Tipos de contrato', url: 'contract' },
            { icon: '/assets/icons/icon-empresa.svg', title: 'Empresa de seguros', url: 'seguros' }

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
