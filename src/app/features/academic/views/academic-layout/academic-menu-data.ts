import { MenuItemInterface } from "../../../../shared/components/main-menu/menu-item.interface.model";


export const menu_data: Array<{ title: string, menuItems: MenuItemInterface[] }> = [
    {
        title: 'CONVALIDACION',
        menuItems: [
            { icon: '/assets/icons/icon-empresa.svg', title: 'Convalidados', url: 'convalidatdos' },
            { icon: 'assets/icons/icon-contrato.svg', title: 'Beta convlaidacion ', url: 'convalidatdos-subjects' },
            { icon: 'assets/icons/icon-estructura.svg', title: 'Universidades', url: 'university-origin' },
            { icon: 'assets/icons/icon-contrato.svg', title: 'Carreras', url: 'career-origin' },
            { icon: 'assets/icons/icon-estructura.svg', title: 'Asignaturas', url: 'subjects-origin' },
            { icon: 'assets/icons/icon-estructura.svg', title: 'Estudiantes', url: 'student-enrollment' },     
        ],
    },
    // {
    //     title: 'Instituciones de Origen',
    //     menuItems: [
    //         { icon: 'assets/icons/icon-estructura.svg', title: 'Universidades', url: 'university-origin' },
    //         { icon: 'assets/icons/icon-contrato.svg', title: 'Carreras', url: 'career-origin' },
    //         { icon: 'assets/icons/icon-estructura.svg', title: 'Asignaturas', url: 'subjects-origin' },
    //         { icon: 'assets/icons/icon-estructura.svg', title: 'Estudiantes', url: 'student-enrollment' },            
    //     ],
    // },
    {
        title: 'HOMOLOGACION',
        menuItems: [
            { icon: '/assets/icons/icon-empresa.svg', title: 'Equivalencias pensum', url: 'TableEquivalence' },
            { icon: 'assets/icons/icon-estructura.svg', title: 'Lista Estudiantes', url: 'LisStudents' },
            { icon: 'assets/icons/icon-contrato.svg', title: 'Carreras de Origen', url: 'LisAprovelSubjectsStudents' },
        ],
    },
];
