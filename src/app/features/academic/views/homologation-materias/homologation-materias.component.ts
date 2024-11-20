import { Component, OnInit } from '@angular/core';
import { AcadeicListStudentsService } from '../../services/homologation/acadeic-list-students.service';
import { ActivatedRoute } from '@angular/router';
import { Career, MateriaHomologada, MateriaNoHomologada, MateriasHomologadas, MateriasHomologadasResponse, MateriasNoHomologadas, MateriasNoHomologadasResponse, Student } from '../../services/homologation/estudent';
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
  materiasDeshabilitadas: any[] = [];  // Lista de materias deshabilitadas
  isOpen = false;
  modalMessage = '¿Está seguro de deshabilitar esta materia?';
  justificacion = '';
  selectedMateria: any = null;
  homologationId: number = 0;
  materiasNoHomologadas: MateriasNoHomologadas[] = [];
  materiasHomologadas: MateriasHomologadas[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private homologationMateriasService: HomologationMateriasService
  ) {}

  ngOnInit(): void {
    const studentId = this.route.snapshot.queryParams['id'];
    this.homologationId = this.route.snapshot.queryParams['homologationId'] ?? 0;
    if (studentId) {
      this.fetchStudentData(studentId);
    }
    if (this.homologationId) {
      this.loadMateriasNoHomologadas(this.homologationId);
      this.loadMateriasHomologadas(this.homologationId);
    }
  }

  loadMateriasNoHomologadas(homologationId: number): void {
    this.homologationMateriasService.getbyhomologationEstudiantePensumId(homologationId)
      .subscribe(
        (response: MateriasNoHomologadasResponse[]) => {
          if (response?.[0]?.materiasNoHomologadas?.length) {
            this.materiasNoHomologadas = response[0].materiasNoHomologadas;
          }
        },
        error => console.error('Error al obtener las materias no homologadas:', error)
      );
  }

  loadMateriasHomologadas(homologationId: number): void {
    this.homologationMateriasService.getbyhomologationEstudianteId(homologationId)
      .subscribe(
        (response: MateriasHomologadasResponse[]) => {          
          if (response?.[0]?.materiasHomologadas?.length) {
            const materias = response[0].materiasHomologadas;
            // Filtra las materias según su estado
            this.materiasHomologadas = materias.filter(materia => materia.estado === true);
            this.materiasDeshabilitadas = materias.filter(materia => materia.estado === false);
          } else {
            console.log('No se encontraron materias homologadas.');
            this.materiasHomologadas = [];
            this.materiasDeshabilitadas = [];
          }
        },
        error => console.error('Error al obtener las materias homologadas:', error)
      );
  }
  
  
  private fetchStudentData(studentId: number): void {
    this.homologationMateriasService.getPensumActual(studentId).subscribe(
      (studentResponse) => {
        this.studentData = studentResponse;
        console.log('Student Data:', this.studentData);
        this.loadCareerPensums();
      },
      (error) => console.error('Error fetching student data', error)
    );
  }

  private loadCareerPensums(): void {
    const careerId = this.studentData?.carrera?.carreraId;
    const currentPensumId = this.studentData?.pensums?.[0]?.pensumId;
    if (!careerId || currentPensumId === undefined) {
      console.warn('Datos insuficientes para buscar pensum para homologar');
      return;
    }
    this.homologationMateriasService.getHomologationSubjectbyId(careerId).subscribe(
      (careerResponse) => {
        this.pensums = careerResponse.pensums.map((pensum) => ({
          anio: pensum.anio,
          id: pensum.id,
        }));
        const nextPensum = this.pensums.find((pensum) => pensum.id > currentPensumId);
        if (nextPensum) {
          this.getHomologatedSubjects(currentPensumId, nextPensum.id);
        }
      },
      (error) => console.error('Error fetching career pensums', error)
    );
  }

  getHomologatedSubjects(pensumIdOrigen: number, pensumIdDestino: number): void {
    this.homologationMateriasService.getHomologatedSubjects(pensumIdOrigen, pensumIdDestino).subscribe(
      (homologationSubjects) => {
        if (this.studentData?.pensums) {
          this.studentData.pensums.forEach((pensum) => {
            if (pensum.materiasAprobadas) {
              pensum.materiasAprobadas.forEach((materiaAprobada) => {
                const materiaHomologada = homologationSubjects.find(
                  (subject) => subject.idMateriaOrigen === materiaAprobada.materiaId
                );

                if (materiaHomologada) {
                this.verifyAndSaveHomologatedSubject(materiaAprobada, materiaHomologada);
              } else {
                this.verifyAndSaveNoHomologatedSubject(materiaAprobada);
              }
              });
            }
          });
        }
      },
      (error) => {
        console.error('Error al obtener las materias homologadas', error);
      }
    );
  }

  private verifyAndSaveHomologatedSubject(materiaAprobada: any, materiaHomologada: any): void {
    this.homologationMateriasService.getAllMateriaHomologada().subscribe(
      (existingMateriaHomologada) => {
        // Verifica si la materia homologada ya existe
        const materiaExistente = existingMateriaHomologada.find(
          (item) =>
            item.estudiantePensumId === Number(this.homologationId) &&
            item.materiaOrigenId === materiaAprobada.materiaId &&
            item.materiaDestinoId === materiaHomologada.idMateriaDestino
        );
  
        if (!materiaExistente) {
          console.log('Materia homologada no encontrada. Procediendo a guardar.');
          
          const materiaHomologadaData: MateriaHomologada = {
            id: 0, // Siempre será 0
            estudiantePensumId: Number(this.homologationId),
            materiaOrigenId: materiaAprobada.materiaId,
            materiaDestinoId: materiaHomologada.idMateriaDestino,
            calificacion: materiaAprobada.calificacion,
            estado: true, // Siempre estado true
            justificacion: '', // Justificación vacía
          };
          console.log('Materia homologada a guardar:', materiaHomologadaData);
          this.homologationMateriasService.createMateriaHomologada(materiaHomologadaData).subscribe(
            (response) => {
              console.log('Materia homologada guardada exitosamente:', response);
              // Actualiza la lista después de guardar
              this.loadMateriasHomologadas(Number(this.homologationId));
            },
            (error) => {
              console.error('Error al guardar materia homologada:', error);
            }
          );
        } else {
          console.log('Materia homologada ya existe.');
        }
      },
      (error) => {
        console.error('Error al obtener materias homologadas:', error);
      }
    );
  }


  private verifyAndSaveNoHomologatedSubject(materia: any): void {
    this.homologationMateriasService.getAllMateriaNoHomologada().subscribe(
      (existingMateriaNoHomologada) => {
        // Comparar si la materia ya existe
        const materiaExistente = existingMateriaNoHomologada.find(
          (item) =>
            item.estudiantePensumId === Number(this.homologationId) &&
            item.materiaOrigenId === materia.materiaId
        );
  
        if (materiaExistente) {
          console.log('La materia ya está registrada.');
        } else {
          console.log('Materia no encontrada. Procediendo a guardar.');
  
          const materiaNoHomologada = {
            id: 0, // Siempre será 0
            estudiantePensumId: Number(this.homologationId),
            materiaOrigenId: materia.materiaId,
            calificacion: materia.calificacion,
          };
  
          this.homologationMateriasService.createMateriaNoHomologada(materiaNoHomologada).subscribe(
            (response) => {
              console.log('Materia no homologada guardada exitosamente:', response);
              // Actualiza la lista después de guardar
              this.loadMateriasNoHomologadas(Number(this.homologationId));
            },
            (error) => {
              console.error('Error al guardar materia no homologada:', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error al obtener materias no homologadas:', error);
      }
    );
  }

  confirmDeshabilitar(id: number): void {
    // Ahora "id" debería estar correctamente tipado
    this.homologationMateriasService.getByIdMateriaHomologada(id).subscribe(
      (materia) => {
        this.selectedMateria = materia;
        this.isOpen = true;
        this.modalMessage = `¿Está seguro de deshabilitar esta materia?`;
        this.justificacion = ''; // Deja vacío el campo de justificación si es necesario
      },
      (error) => {
        console.error('Error al obtener la materia homologada:', error);
      }
    );
  }
  

  deshabilitarMateria(): void {
    if (!this.justificacion || this.justificacion.trim() === '') {
      alert('Por favor, ingrese una justificación antes de proceder.');
      return; // Evita continuar si el campo está vacío
    }
  
    if (this.selectedMateria && this.selectedMateria.id) {
      this.homologationMateriasService.getByIdMateriaHomologada(this.selectedMateria.id).subscribe(
        (materiaExistente) => {
          const materiaModificada: MateriaHomologada = {
            ...materiaExistente,   
            estado: false,  
            justificacion: this.justificacion, // Se agrega la justificación al objeto
          };
          console.log('Materia modificada:', materiaModificada);
          this.homologationMateriasService.createMateriaHomologada(materiaModificada).subscribe(
            (response) => {
              console.log('Materia deshabilitada exitosamente:', response);
              this.isOpen = false;
              this.loadMateriasHomologadas(this.selectedMateria.estudiantePensumId);
            },
            (error) => {
              console.error('Error al deshabilitar la materia:', error);
            }
          );
        },
        (error) => {
          console.error('Error al obtener los datos de la materia:', error);
        }
      );
    }
  }
  

onCancelDelete(): void {
    this.isOpen = false;
    this.justificacion = '';
}

habilitarMateria(materia: any): void {
  if (materia && materia.id) {
    // Llamar al servicio para obtener la materia existente por su ID
    this.homologationMateriasService.getByIdMateriaHomologada(materia.id).subscribe(
      (materiaExistente) => {
        // Crear una nueva materia modificada, cambiando el estado a true
        const materiaModificada: MateriaHomologada = {
          ...materiaExistente,
          estado: true, // Cambiar el estado a true
        };
        console.log('Materia modificada:', materiaModificada);

        // Enviar la materia modificada al backend para actualizarla
        this.homologationMateriasService.createMateriaHomologada(materiaModificada).subscribe(
          (response) => {
            console.log('Materia habilitada exitosamente:', response);
            // Recargar las materias homologadas después de habilitar
            window.location.reload();
          },
          (error) => {
            console.error('Error al habilitar la materia:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener los datos de la materia:', error);
      }
    );
  }
}


isOpenJustificacionModal: boolean = false; // Modal inicialmente cerrado

  selectedJustificacion: string = '';

// Modal que se abre cuando se hace clic en "Ver justificación"
// Método para abrir el modal con la justificación cargada
openJustificacionModal(id: number): void {
  this.homologationMateriasService.getByIdMateriaHomologada(id).subscribe(
    (materia) => {
      this.selectedMateria = materia; // Guarda la materia seleccionada
      this.justificacion = materia.justificacion || ''; // Carga la justificación en el campo
      this.isOpenJustificacionModal = true; // Abre el modal
    },
    (error) => {
      console.error('Error al obtener la materia homologada:', error);
    }
  );
}

// Método para guardar la justificación editada
guardarJustificacion(): void {
  if (!this.justificacion || this.justificacion.trim() === '') {
    alert('Por favor, ingrese una justificación antes de proceder.');
    return; // Evita continuar si el campo está vacío
  }

  if (this.selectedMateria && this.selectedMateria.id) {
    const materiaModificada = {
      ...this.selectedMateria, 
      justificacion: this.justificacion, // Guarda la justificación editada
    };

    this.homologationMateriasService.createMateriaHomologada(materiaModificada).subscribe(
      (response) => {
        console.log('Justificación guardada exitosamente:', response);
        this.isOpenJustificacionModal = false; // Cierra el modal
        this.loadMateriasHomologadas(this.selectedMateria.estudiantePensumId); // Recarga las materias
      },
      (error) => {
        console.error('Error al guardar la justificación:', error);
      }
    );
  }
}

verJustificacion(id: number): void {
  this.openJustificacionModal(id); // Llama al modal con la materia seleccionada
}

isModalOpen: boolean = false; // Controla la visibilidad del modal

  // Función para abrir el modal
  openConfirmModal(): void {
    this.isModalOpen = true; // Abre el modal
  }

  confirmarHomologacion(): void {
    this.isModalOpen = false; // Cierra el modal
    window.history.back(); // Vuelve a la pestaña anterior
  }

  cancelarConfirmacion(): void {
    this.isModalOpen = false; // Cierra el modal
  }
}