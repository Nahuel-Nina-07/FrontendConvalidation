import { Component, OnInit } from '@angular/core';
import { AcadeicListStudentsService } from '../../services/homologation/acadeic-list-students.service';
import { ActivatedRoute } from '@angular/router';
import { Career, Student } from '../../services/homologation/estudent';
import { CommonModule } from '@angular/common';
import { HomologationMateriasService } from '../../services/homologation/homologation-materias.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-homologation-materias',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './homologation-materias.component.html',
  styleUrl: './homologation-materias.component.scss'
})
export class HomologationMateriasComponent implements OnInit {
  studentData: Student | null = null;
  pensums: { anio: number, id: number }[] = [];
  materiasHomologables: any[] = [];  // Materias que sí pueden homologarse
  materiasNoHomologables: any[] = [];  // Materias que no pueden homologarse

  materiasDeshabilitadas: any[] = [];  // Lista de materias deshabilitadas
  isOpen = false;
  modalMessage = '¿Está seguro de deshabilitar esta materia?';
  justificacion = '';
  selectedMateria: any = null;
  constructor(
    private route: ActivatedRoute,
    private homologationMateriasService: HomologationMateriasService
  ) {}

  ngOnInit(): void {
    const studentId = this.route.snapshot.queryParams['id'];
    if (studentId) {
      this.homologationMateriasService.getPensumActual(studentId).subscribe(studentResponse => {
        this.studentData = studentResponse;
        console.log("Student Data:", this.studentData);
  
        // Verifica si existen pensums en el objeto studentData
        if (this.studentData?.pensums) {
          // Itera sobre los pensums
          this.studentData.pensums.forEach(pensum => {
            console.log("Pensum ID:", pensum.pensumId); // Muestra el pensumId
  
            // Verifica si hay materias aprobadas
            if (pensum.materiasAprobadas) {
              pensum.materiasAprobadas.forEach(materia => {
                console.log("Materia Aprobada ID:", materia.materiaId);  // Muestra el materiaId
              });
            }
          });
        }
        this.loadCareerPensums();
      });
    }
  }

  private loadCareerPensums(): void {
    const careerId = this.studentData?.carrera?.carreraId;
    const currentPensumId = this.studentData?.pensums?.[0]?.pensumId; // Obtener el pensumId del estudiante

    if (careerId && currentPensumId !== undefined) {  // Verifica que currentPensumId esté definido
      this.homologationMateriasService.getHomologationSubjectbyId(careerId).subscribe(careerResponse => {
        this.pensums = careerResponse.pensums.map(pensum => ({
          anio: pensum.anio,
          id: pensum.id
        }));
        console.log("Pensums:", this.pensums);

        // Filtrar el siguiente pensumId mayor al pensumId actual del estudiante
        const nextPensum = this.pensums.find(pensum => pensum.id > currentPensumId);

        if (nextPensum) {
          console.log("Siguiente Pensum ID:", nextPensum.id);
          // Llamada a la función para obtener las materias homologadas
          this.getHomologatedSubjects(currentPensumId, nextPensum.id);
        } else {
          console.log("No hay pensum para homologar");
        }
      });
    } else {
      console.log("Datos insuficientes para buscar pensum para homologar");
    }
  }

  getHomologatedSubjects(pensumIdOrigen: number, pensumIdDestino: number): void {
    this.homologationMateriasService.getHomologatedSubjects(pensumIdOrigen, pensumIdDestino).subscribe(
      (homologationSubjects) => {
        console.log("Materias homologadas:", homologationSubjects);
  
        // Iterar sobre las materias homologadas y obtener todos los idMateriaOrigen
        const idsMateriaOrigen = homologationSubjects.map(subject => subject.idMateriaOrigen);
    
        console.log("IDs de Materias Origen:", idsMateriaOrigen);
    
        // Iterar sobre las materias aprobadas del estudiante
        if (this.studentData?.pensums) {
          this.studentData.pensums.forEach(pensum => {
            if (pensum.materiasAprobadas) {
              pensum.materiasAprobadas.forEach(materiaAprobada => {
                // Verificar si la materia aprobada está en las materias de origen
                const materiaHomologada = homologationSubjects.find(subject => subject.idMateriaOrigen === materiaAprobada.materiaId);
    
                if (materiaHomologada) {
                  // Si se encuentra, agregar a la lista de materias homologables
                  console.log(`La materia "${materiaAprobada.materiaNombre}" con código origen ${materiaAprobada.materiaId} y calificación ${materiaAprobada.calificacion} puede homologarse con la materia "${materiaHomologada.nombreMateriaDestino}" con código destino ${materiaHomologada.idMateriaDestino}`);
                  this.materiasHomologables.push({
                    materiaOrigen: materiaAprobada.materiaNombre,
                    codigoOrigen: materiaAprobada.materiaCodigo,
                    materiaDestino: materiaHomologada.nombreMateriaDestino,
                    codigoDestino: materiaHomologada.codigoMateriaDestino,
                    idMateriaDestino:materiaHomologada.idMateriaDestino,
                    idMateriaOrigen:materiaHomologada.idMateriaOrigen,
                    calificacion: materiaAprobada.calificacion
                  });
                } else {
                  // Si no se encuentra, agregar a la lista de materias no homologables
                  console.log(`La materia "${materiaAprobada.materiaNombre}" con código origen ${materiaAprobada.materiaId} y calificación ${materiaAprobada.calificacion} no es válida para homologar`);
                  this.materiasNoHomologables.push({
                    materiaOrigen: materiaAprobada.materiaNombre,
                    codigoOrigen: materiaAprobada.materiaCodigo,
                    calificacion: materiaAprobada.calificacion
                  });
                }
              });
            }
          });
        }
        // Mostrar las listas de materias homologables y no homologables
        console.log("Materias Homologables:", this.materiasHomologables);
        console.log("Materias No Homologables:", this.materiasNoHomologables);
      },
      (error) => {
        console.error("Error al obtener las materias homologadas", error);
      }
    );
  }


  confirmDeshabilitar(materia: any): void {
    this.selectedMateria = materia; // Guardar la materia seleccionada
    this.isOpen = true; // Abrir el modal
    this.modalMessage = `¿Está seguro de deshabilitar la materia "${materia.materiaOrigen}"?`;
}

onConfirmDelete(): void {
    // Guardar la información de la materia deshabilitada con la justificación
    if (this.justificacion.trim()) {
        // Agregar la materia a la lista de materias deshabilitadas
        this.materiasDeshabilitadas.push({
            idMateriaOrigen: this.selectedMateria.idMateriaOrigen,
            idMateriaDestino: this.selectedMateria.idMateriaDestino,
            codigoDestino: this.selectedMateria.codigoDestino,
            codigoOrigen: this.selectedMateria.codigoOrigen,
            nombreOrigen: this.selectedMateria.materiaOrigen,
            nombreDestino: this.selectedMateria.materiaDestino,
            calificacion: this.selectedMateria.calificacion,
            justificacion: this.justificacion,
            estado: false
        });

        // Eliminar la materia de la lista de materias homologables
        const index = this.materiasHomologables.findIndex(materia => materia.idMateriaOrigen === this.selectedMateria.idMateriaOrigen);
        if (index !== -1) {
            this.materiasHomologables.splice(index, 1);
        }

        console.log("Materia deshabilitada guardada:", this.materiasDeshabilitadas);
        
        // Cerrar el modal y resetear la justificación
        this.isOpen = false;
        this.justificacion = '';
    } else {
        alert("Por favor ingrese una justificación.");
    }
}

onCancelDelete(): void {
    // Cerrar el modal sin hacer nada
    this.isOpen = false;
    this.justificacion = '';
}

habilitarMateria(materia: any): void {
  // Eliminar la materia de la lista de deshabilitadas
  const index = this.materiasDeshabilitadas.indexOf(materia);
  if (index > -1) {
    this.materiasDeshabilitadas.splice(index, 1); // Eliminar de la lista de deshabilitadas
    // Agregarla nuevamente a la lista de homologables
    this.materiasHomologables.push(materia);
    console.log("Materia habilitada y movida de nuevo:", materia);
  }
}

}  
