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
  isModalOpen: boolean = false;
  modalMessage: string = '';
  isOpen: boolean = false;
  homologationToDelete: Homologacion | null = null;

  constructor(private homologationService: HomologationAcademicTableEquivalenceService) {}

  ngOnInit(): void {
    this.loadCareers();
  }

  private loadCareers(): void {
    this.homologationService.getCareers().subscribe(
      (data: Career[]) => this.careers = data,
      error => console.error('Error fetching careers:', error)
    );
  }

  onCareerChange(event: Event): void {
    const selectedCareerId = (event.target as HTMLSelectElement).value;
    if (selectedCareerId) {
      this.selectedCareerId = Number(selectedCareerId);
      this.loadPensums();
    }
  }

  private loadPensums(): void {
    const selectedCareer = this.careers.find(career => career.id === this.selectedCareerId);
    if (selectedCareer) {
      this.pensums = selectedCareer.pensums.slice();
    } else {
      this.pensums = [];
    }
    this.resetPensumData();
  }

private resetPensumData(): void {
  this.pensumDestinoValue = 'Elige el pensum de origen';
  this.materiasOrigen = [];
  this.materiasDestino = [];
  this.homologations = [];
}

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
      this.loadHomologatedSubjects(this.selectedPensumOrigen.id);
    }
  }

  loadMaterias(): void {
    if (!this.selectedPensumOrigen) return;
  
    const currentPensum = this.selectedPensumOrigen;
    console.log('Loading materias for Pensum:', currentPensum);
  
    // Filtrar materias origen: Solo materias que no estén en las homologaciones
    this.materiasOrigen = currentPensum.materias.filter(materia =>
      !this.homologations.some(h => h.codigoMateriaOrigen === materia.codigo)  // Usar el código de la materia
    );
    console.log('Materias Origen:', this.materiasOrigen);
  
    const nextPensumIndex = this.pensums.indexOf(currentPensum) + 1;
    if (nextPensumIndex < this.pensums.length) {
      const nextPensum = this.pensums[nextPensumIndex];
  
      // Filtrar materias destino: Solo materias que no estén en las homologaciones
      this.materiasDestino = nextPensum.materias.filter(materia =>
        !this.homologations.some(h => h.codigoMateriaDestino === materia.codigo)  // Usar el código de la materia
      );
      console.log('Materias Destino:', this.materiasDestino);
      this.updatePensumDestino(nextPensum);
    } else {
      this.materiasDestino = [];
      this.pensumDestinoValue = 'No hay más pensums';
    }
  }
  

  private updatePensumDestino(pensum: Pensum): void {
    this.pensumDestinoValue = `Pensum ${pensum.anio}`;
  }

  saveHomologation(): void {
    const selectedMateriaOrigen = this.materiasOrigen.find(materia => materia.nombre === this.selectedMateriaNombre('materiaOrigen'));
    const selectedMateriaDestino = this.materiasDestino.find(materia => materia.nombre === this.selectedMateriaNombre('materiaDestino'));

    if (!selectedMateriaOrigen || !selectedMateriaDestino) {
      this.modalMessage = 'Debes seleccionar una materia de ' + 
                          (!selectedMateriaOrigen ? 'origen' : 'destino') + '.';
      this.isModalOpen = true;
      return;
    }

    this.createHomologation(selectedMateriaOrigen, selectedMateriaDestino);
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  private selectedMateriaNombre(id: string): string {
    return (document.getElementById(id) as HTMLSelectElement).value;
  }

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
        const pensumOrigenId = this.selectedPensumOrigen ? this.selectedPensumOrigen.id : null;
        if (pensumOrigenId !== null) {
          this.loadHomologatedSubjects(pensumOrigenId); 
        }
      },
      error => console.error('Error al guardar la homologación:', error)
    );
  }

  deleteHomologation(id: number, nombreMateriaOrigen: string, nombreMateriaDestino: string): void {
    this.homologationToDelete = this.homologations.find(h => h.id === id) || null;
  
    if (this.homologationToDelete) {
      this.showDeleteConfirmation(nombreMateriaOrigen, nombreMateriaDestino);
    }
  }
  
  showDeleteConfirmation(materiaOrigen: string, materiaDestino: string): void {
    this.isOpen = true;
    this.modalMessage = `¿Estás seguro de eliminar la homologación de "${materiaOrigen}" y "${materiaDestino}"?`;
  }
  
  onConfirmDelete(): void {
    if (this.homologationToDelete) {
      this.homologationService.deleteHomologation(this.homologationToDelete.id).subscribe(
        () => {
          this.homologations = this.homologations.filter(h => h.id !== this.homologationToDelete?.id);
          this.loadMaterias();  // Recargar las materias después de eliminar
          this.isOpen = false;
        },
        error => console.error('Error al eliminar la homologación:', error)
      );
    }
  }

onCancelDelete(): void {
  this.isOpen = false; 
}

loadHomologatedSubjects(pensumOrigenId: number): void {
  const pensumDestinoId = this.selectedPensumOrigen ? this.pensums[this.pensums.indexOf(this.selectedPensumOrigen) + 1]?.id : null;
  if (!pensumDestinoId) return;

  console.log('Cargando homologaciones para Pensum Origen:', pensumOrigenId, 'y Pensum Destino:', pensumDestinoId);

  this.homologationService.getHomologatedSubjects(pensumOrigenId, pensumDestinoId).subscribe(
    (data: Homologacion[]) => {
      console.log('Datos de homologaciones recibidos:', data);
      this.homologations = data;
      this.loadMaterias(); // Llamar a loadMaterias para actualizar las listas después de obtener las homologaciones
    },
    error => {
      console.error('Error al obtener homologaciones:', error);
    }
  );
}

}