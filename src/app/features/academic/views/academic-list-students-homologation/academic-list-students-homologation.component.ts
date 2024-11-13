import { Component, OnInit } from '@angular/core';
import { SuintPageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { ListAllComponent } from "../../../../shared/components/list-all/list-all.component";
import { SuintButtonComponent } from "../../../../shared/components/suint-button/suint-button.component";
import { Student } from '../../services/homologation/estudent';
import { AcadeicListStudentsService } from '../../services/homologation/acadeic-list-students.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-academic-list-students-homologation',
  standalone: true,
  imports: [SuintPageHeaderComponent, ListAllComponent,],
  templateUrl: './academic-list-students-homologation.component.html',
  styleUrl: './academic-list-students-homologation.component.scss'
})
export class AcademicListStudentsHomologationComponent  implements OnInit {

  constructor(private academicListStudentsService: AcadeicListStudentsService,
    private router: Router
  ) { }

  estudiantes: Student[] = [];

  ngOnInit(): void {
    this.getAllStudents();
  }

  tableColumns = [
    { header: 'Nombre', field: 'nombre' },
    { header: 'Universidad', field: 'carrera.careerName' },
  ];

  additionalColumns = [
    {
      header: 'Asignaturas',
      buttons: [
        { name: 'Unidades', iconSrc: 'assets/icons/icon-subject.svg', action: this.downloadDocument.bind(this) },
      ]
    }
  ];

  downloadDocument(item: Student) {
    console.log('Redirigiendo a documentos para estudiante:', item);
    this.router.navigate(['/academico/LisAprovelSubjectsStudents'], {
      queryParams: {
        id: item.id,
      }
    });
}


  openAddModal() {
    console.log('Open model for item:');
  }

  onDelete(item: any): void {
    
  }

  onEdit(item: any): void {
    
  }

  getAllStudents(): void {
    this.academicListStudentsService.getStudents().subscribe(
      (data: Student[]) => {
        this.estudiantes = data.map(student => ({
          ...student,
          fullName: `${student.nombre} ${student.apellido}`  // Agrega el nombre completo al objeto
        }));
      },
      (error) => {
        console.error('Error al obtener estudiantes', error);
      }
    );
  }
}
