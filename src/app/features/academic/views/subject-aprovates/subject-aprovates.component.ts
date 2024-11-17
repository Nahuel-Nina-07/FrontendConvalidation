import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AcadeicListStudentsService } from '../../services/homologation/acadeic-list-students.service';
import { HomologationPensumEstudent, Pensum, Student, UpdatedStudent } from '../../services/homologation/estudent';
import { CommonModule } from '@angular/common';
import { SuintPageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { HomologationMateriasService } from '../../services/homologation/homologation-materias.service';

@Component({
  selector: 'app-subject-aprovates',
  standalone: true,
  imports: [CommonModule, SuintPageHeaderComponent],
  templateUrl: './subject-aprovates.component.html',
  styleUrl: './subject-aprovates.component.scss'
})
export class SubjectAprovatesComponent implements OnInit {
  studentData: Student | null = null;
  studentId: string | null = null; 
  pensums: {id: number,anio:number }[] = [];
  isOpen: boolean = false; // Para controlar la visibilidad del modal
  modalMessage: string = "¿Estás seguro de realizar el proceso de este estudiante?"; // Mensaje que se mostrará en el modal
  pensumss: Pensum[] = [];
  modalAction: 'Delete' | 'ConfirmHomologate' | 'Homologation' | null = null;
  isDuplicateHomologationOpen: boolean = false;
  extraStudentData: any; 

  constructor(
    private route: ActivatedRoute, 
    private academicListStudentsService: AcadeicListStudentsService,
    private homologationMateriasService: HomologationMateriasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const studentId = this.route.snapshot.queryParams['id'];
    if (studentId) {
      this.studentId = studentId; // Asigna el studentId al componente
      this.academicListStudentsService.getPensumActual(studentId).subscribe(studentResponse => {
        this.studentData = studentResponse;
        console.log("Student Data:", this.studentData); // Imprime los datos del estudiante

        // Obtén los datos adicionales del estudiante
        this.homologationMateriasService.getByIdEstudainte(Number(studentId)).subscribe(extraStudentData => {
          console.log('Datos adicionales del estudiante:', extraStudentData);
          const { pensumId, ...otherData } = extraStudentData;
          this.extraStudentData = otherData;
          
        });

        this.academicListStudentsService.getGetByIdEstudiantePensum(Number(studentId)).subscribe(pensumResponse => {
          console.log('Pensum Data:', pensumResponse); // Imprime los datos del pensum
          if (pensumResponse?.pensums) {
            // Asegúrate de que los datos están en el formato correcto
            this.pensumss = pensumResponse.pensums;
          }
        }, error => {
          console.error('Error al obtener los datos del pensum:', error);
        });

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
          id: pensum.id,
          anio:pensum.anio
        }));
        console.log("Pensums:", this.pensums);
        const nextPensum = this.pensums.find(pensum => pensum.id > currentPensumId);

        if (nextPensum) {
          console.log("Siguiente Pensum ID:", nextPensum.id);
        } else {
          console.log("No hay pensum para homologar");
        }
      });
    } else {
      console.log("Datos insuficientes para buscar pensum para homologar");
    }
  }

  selectedPensumId: number | null = null;
  onConfirm() {
    if (this.modalAction === 'Delete' && this.selectedPensumId !== undefined && this.selectedPensumId !== null) {

      this.academicListStudentsService.deletePensum(this.selectedPensumId).subscribe({
        next: (response) => {
          console.log('Pensum eliminado con éxito', response);
          this.pensumss = this.pensumss.filter(pensum => pensum.id !== this.selectedPensumId);
          this.isOpen = false; // Cerrar el modal
        },
      });
    } else if (this.modalAction === 'ConfirmHomologate'  && this.selectedPensumId !== undefined && this.selectedPensumId !== null) {
      this.onConfirmHomologationWithTrue(); // Llamar a la función con estado true
      this.loadCareerPensums();
    } else if (this.modalAction === 'Homologation') {
      this.onConfirmHomologation();
    } else {
      console.log('Acción no reconocida');
    }
  }

  redirectToHomologation() {
    if (this.studentId) {
      this.router.navigate(['/academico/HomologationMaterias'], {
        queryParams: { id: this.studentId }
      });
    } else {
      console.error('El ID del estudiante no está disponible para la redirección');
    }
  }

  onConfirmHomologationWithTrue() {
    if (this.studentId && this.studentData) {
      const currentPensumId = this.studentData.pensums?.[0]?.pensumId;
      const nextPensum = this.pensums.find(pensum => pensum.id > currentPensumId);
  
      if (nextPensum) {
        const homologationData: HomologationPensumEstudent = {
          id: this.selectedPensumId || 0,
          estudianteId: parseInt(this.studentId),
          pensumOrigenId: currentPensumId,
          pensumDestinoId: nextPensum.id,
          estado: true
        };
  
        console.log('Datos enviados al backend (estado true):', homologationData);
  
        const updatedStudentData: UpdatedStudent = {
          id: this.studentData.id,
          nombre: this.studentData.nombre,
          carreraId: this.studentData.carreraId,
          estado: this.studentData.estado,
          pensumId: nextPensum.id,
          ...this.extraStudentData
        };
  
        console.log('Datos enviados al backend:', updatedStudentData);
  
        // Actualizar el estudiante
        this.homologationMateriasService.updateEstudainte(updatedStudentData).subscribe({
          next: response => {
            console.log('Estudiante actualizado:', response);
  
            // Llamada para crear la homologación
            this.academicListStudentsService.createHomologationSubject(homologationData).subscribe({
              next: response => {
                console.log('Homologación creada con estado true:', response);
  
                 window.location.reload(); // Recarga la página para actualizar el estado
              },
              error: error => {
                console.error('Error al crear la homologación:', error);
              }
            });
          },
          error: error => {
            console.error('Error al actualizar el estudiante:', error);
          }
        });
      } else {
        this.isOpen = false;
      }
    }
  }
  
  private loadUpdatedPensums(): void {
    if (this.studentId) {
      this.academicListStudentsService.getGetByIdEstudiantePensum(Number(this.studentId)).subscribe({
        next: pensumResponse => {
          if (pensumResponse?.pensums) {
            this.pensumss = pensumResponse.pensums;
            console.log('Pensum actualizado:', this.pensumss);
          }
        },
        error: error => {
          console.error('Error al cargar los pensums actualizados:', error);
        }
      });
    }
  }
  

  
  onConfirmHomologation() {
    if (this.studentId && this.studentData) {
      const currentPensumId = this.studentData.pensums?.[0]?.pensumId;
      const nextPensum = this.pensums.find(pensum => pensum.id > currentPensumId);
  
      if (nextPensum) {
        const pensumOrigenId = currentPensumId;
        const pensumDestinoId = nextPensum.id;
  
        // Verificar si ya existe una homologación con los mismos IDs en la lista
        const existingHomologation = this.pensumss.find(pensum => 
          pensum.pensumOrigenId === pensumOrigenId && pensum.pensumDestinoId === pensumDestinoId);
  
        if (existingHomologation) {
          // Si ya existe, mostrar modal de error y evitar la creación
          this.isDuplicateHomologationOpen = true;
          this.isOpen = false; // Cierra cualquier otro modal que esté abierto
        } else {
          // Si no existe, crear nueva homologación
          const homologationData: HomologationPensumEstudent = {
            id: 0,
            estudianteId: parseInt(this.studentId),
            pensumOrigenId: pensumOrigenId,
            pensumDestinoId: pensumDestinoId,
            estado: false
          };
  
          console.log('Datos enviados al backend:', homologationData);
  
          this.academicListStudentsService.createHomologationSubject(homologationData).subscribe({
            next: response => {
              console.log('Homologación creada:', response);
              this.isOpen = false;
              this.router.navigate(['/academico/HomologationMaterias'], {
                queryParams: { id: this.studentId }
              });
            }
          });
        }
      } else {
        alert('No hay pensum para homologar');
        this.isOpen = false;
      }
    }
  }
    
  onCancelHomologation() {
    this.isOpen = false;
  }
  onCancel() {
    this.isOpen = false;
    this.isDuplicateHomologationOpen = false;
  }

  onDelete(id: number) {
    this.modalMessage = '¿Estás seguro de eliminar este pensum?'; // Establecer el mensaje para eliminar
    this.modalAction = 'Delete'; // Definir que la acción es eliminar
    this.selectedPensumId = id; // Guardar el id del pensum que se eliminará
    this.isOpen = true; // Abrir el modal
  }
  
  onConfirmHomologate(id: number) {
    this.modalMessage = '¿Estás seguro de confirmar la homologación?'; // Establecer el mensaje para homologación
    this.modalAction = 'ConfirmHomologate'; // Definir que la acción es homologar
    this.selectedPensumId = id; 
    this.isOpen = true;
  }

  onHomologation() {
    if (this.studentData && this.studentData.pensums && this.studentData.pensums[0]) {
      const anio = this.studentData.pensums[0].anio;  // Obtener el anio del pensum
      const nombreEstudiante = this.studentData.nombre;  // Obtener el nombre del estudiante
  
      this.modalMessage = `¿Estás seguro de realizar la homologación del pensum ${anio} del estudiante ${nombreEstudiante}?`;
      this.modalAction = 'Homologation';  // Definir que la acción es homologar
      this.isOpen = true;
    } else {
      console.error("Datos de estudiante no disponibles o pensum no encontrado");
    }
  }
  
}
