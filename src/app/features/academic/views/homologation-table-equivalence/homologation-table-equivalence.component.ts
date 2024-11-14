import { Component, OnInit } from '@angular/core';
import { SuintPageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { Career, Homologacion, Materia, Pensum } from '../../services/homologation/estudent';
import { HomologationAcademicTableEquivalenceService } from '../../services/homologation/homologation-academic-table-equivalence.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homologation-table-equivalence',
  standalone: true,
  imports: [SuintPageHeaderComponent,HttpClientModule,FormsModule,CommonModule],
  templateUrl: './homologation-table-equivalence.component.html',
  styleUrl: './homologation-table-equivalence.component.scss'
})
export class HomologationTableEquivalenceComponent implements OnInit {
  careers: Career[] = [];
  pensums: Pensum[] = [];
  selectedCareerId: number = 0;
  selectedPensumOrigen: Pensum | null = null;
  pensumDestinoValue: string = 'Elige el pensum de origen';
  materiasOrigen: Materia[] = [];
  materiasDestino: Materia[] = [];
  homologations: Homologacion[] = [];

  constructor(private homologationService: HomologationAcademicTableEquivalenceService) {}

  ngOnInit(): void {
    this.loadCareers();
  }

  /**
   * Cargar las carreras desde el servicio.
   */
  private loadCareers(): void {
    this.homologationService.getCareers().subscribe(
      (data: Career[]) => this.careers = data,
      error => console.error('Error fetching careers:', error)
    );
  }

  /**
   * Maneja el cambio de carrera seleccionada.
   * Carga los pensums correspondientes.
   */
  onCareerChange(event: Event): void {
    const selectedCareerId = (event.target as HTMLSelectElement).value;
    if (selectedCareerId) {
      this.selectedCareerId = Number(selectedCareerId);
      this.loadPensums();
    }
  }

  /**
   * Cargar los pensums de la carrera seleccionada.
   */
  private loadPensums(): void {
    const selectedCareer = this.careers.find(career => career.id === this.selectedCareerId);
    if (selectedCareer) {
      this.pensums = selectedCareer.pensums.slice();
    } else {
      this.pensums = [];
    }
    this.resetPensumData();
  }

  /**
   * Restablecer los datos relacionados con los pensums.
   */
  private resetPensumData(): void {
    this.pensumDestinoValue = 'Elige el pensum de origen';
    this.materiasOrigen = [];
    this.materiasDestino = [];
  }

  /**
   * Maneja el cambio del pensum seleccionado.
   */
  onPensumChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedPensumAnio = selectElement.value;
    
    if (!selectedPensumAnio) {
      this.pensumDestinoValue = 'Elige el pensum de origen';
      this.materiasOrigen = [];
      this.materiasDestino = [];
      return;
    }
  
    this.selectedPensumOrigen = this.pensums.find(pensum => pensum.anio === Number(selectedPensumAnio)) || null;
  
    if (this.selectedPensumOrigen) {
      this.loadMaterias();
      this.loadHomologatedSubjects(this.selectedPensumOrigen.id);  // Se pasa el ID del pensum origen
    }
  }

  /**
   * Cargar las materias relacionadas con el pensum seleccionado.
   */
  loadMaterias(): void {
    if (!this.selectedPensumOrigen) return;
  
    const currentPensum = this.selectedPensumOrigen;
    console.log('Loading materias for Pensum:', currentPensum);
  
    this.materiasOrigen = currentPensum.materias.filter(materia => 
      !this.homologations.some(h => h.materiaOrigenId === materia.id)
    );
    console.log('Materias Origen:', this.materiasOrigen);
  
    const nextPensumIndex = this.pensums.indexOf(currentPensum) + 1;
    if (nextPensumIndex < this.pensums.length) {
      const nextPensum = this.pensums[nextPensumIndex];
      this.materiasDestino = nextPensum.materias.filter(materia =>
        !this.homologations.some(h => h.materiaDestinoId === materia.id)
      );
      console.log('Materias Destino:', this.materiasDestino);
      this.updatePensumDestino(nextPensum);
    } else {
      this.materiasDestino = [];
      this.pensumDestinoValue = 'No hay más pensums';
    }
  }

  /**
   * Actualizar el valor del pensum destino.
   */
  private updatePensumDestino(pensum: Pensum): void {
    this.pensumDestinoValue = `Pensum ${pensum.anio}`;
  }

  /**
   * Guardar una homologación.
   */
  saveHomologation(): void {
    const selectedMateriaOrigen = this.materiasOrigen.find(materia => materia.nombre === this.selectedMateriaNombre('materiaOrigen'));
    const selectedMateriaDestino = this.materiasDestino.find(materia => materia.nombre === this.selectedMateriaNombre('materiaDestino'));

    if (selectedMateriaOrigen && selectedMateriaDestino) {
      this.createHomologation(selectedMateriaOrigen, selectedMateriaDestino);
    } else {
      console.error('No se seleccionaron las materias de origen o destino');
    }
  }

  /**
   * Obtener el nombre de la materia seleccionada desde el formulario.
   */
  private selectedMateriaNombre(id: string): string {
    return (document.getElementById(id) as HTMLSelectElement).value;
  }

  /**
   * Crear una homologación y enviarla al servicio.
   */
  private createHomologation(materiaOrigen: Materia, materiaDestino: Materia): void {
    const homologation: Homologacion = {
      id: 0,
      materiaOrigenId: materiaOrigen.id,
      materiaDestinoId: materiaDestino.id,
      codigoMateriaOrigen: materiaOrigen.codigo,
      nombreMateriaOrigen: materiaOrigen.nombre,
      codigoMateriaDestino: materiaDestino.codigo,
      nombreMateriaDestino: materiaDestino.nombre
    };

    this.homologationService.createHomologation(homologation).subscribe(
      newHomologation => {
        this.homologations.push(newHomologation);
        this.loadMaterias(); // Refresh materias after saving
      },
      error => console.error('Error al guardar la homologación:', error)
    );
  }

  /**
   * Eliminar una homologación.
   */
  deleteHomologation(id: number): void {
    this.homologationService.deleteHomologation(id).subscribe(
      () => {
        this.homologations = this.homologations.filter(h => h.id !== id);
        this.loadMaterias(); // Refresh materias after deletion
      },
      error => console.error('Error al eliminar la homologación:', error)
    );
  }

  /**
   * Cargar las homologaciones entre pensums.
   */
    loadHomologatedSubjects(pensumOrigenId: number): void {
      const pensumDestinoId = this.selectedPensumOrigen ? this.pensums[this.pensums.indexOf(this.selectedPensumOrigen) + 1]?.id : null;
      if (!pensumDestinoId) return;  // Si no hay un pensum destino, no cargar materias homologadas
    
      console.log('Cargando homologaciones para Pensum Origen:', pensumOrigenId, 'y Pensum Destino:', pensumDestinoId);
      
      this.homologationService.getHomologatedSubjects(pensumOrigenId, pensumDestinoId).subscribe(
        (data: Homologacion[]) => {
          console.log('Datos de homologaciones recibidos:', data);
          this.homologations = data;
        },
        error => {
          console.error('Error al obtener homologaciones:', error);
        }
      );
    }
}