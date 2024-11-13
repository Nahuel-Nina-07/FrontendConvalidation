import { Component, OnInit } from '@angular/core';
import { SuintPageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { Career, Materia, Pensum } from '../../services/homologation/estudent';
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
  selectedPensumIndex: number = -1;  // Set to -1 initially to show the "Elige el pensum de origen" message
  pensumDestinoValue: string = 'Elige el pensum de origen';  // Default value for "Pensum de Destino"
  materiasOrigen: Materia[] = [];  // Lista para materias del pensum origen
  materiasDestino: Materia[] = []; 

  constructor(private homologationService: HomologationAcademicTableEquivalenceService) {}

  ngOnInit(): void {
    this.loadCareers();
  }

  loadCareers(): void {
    this.homologationService.getCareers().subscribe(
      (data: Career[]) => {
        this.careers = data;
      },
      error => {
        console.error('Error fetching careers:', error);
      }
    );
  }

  onCareerChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCareerId = selectElement.value;

    if (selectedCareerId) {
      this.selectedCareerId = Number(selectedCareerId);
      this.loadPensums();
    }
  }

  loadPensums(): void {
    const selectedCareer = this.careers.find(career => career.id === this.selectedCareerId);
    if (selectedCareer) {
      this.pensums = selectedCareer.pensums.slice(0);
    } else {
      this.pensums = [];
    }
    this.pensumDestinoValue = 'Elige el pensum de origen';  // Reset Pensum de Destino message when career changes
  }

  onPensumChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedPensumAnio = selectElement.value;

    if (!selectedPensumAnio) {
      // If the user selects "Selecciona el pensum de origen" again, reset Pensum de Destino
      this.pensumDestinoValue = 'Elige el pensum de origen';
      return;
    }

    this.selectedPensumIndex = this.pensums.findIndex(pensum => pensum.anio === Number(selectedPensumAnio));

    if (this.selectedPensumIndex !== -1) {
      if (this.selectedPensumIndex < this.pensums.length - 1) {
        // If it's not the last visible pensum, set the next one
        const nextPensum = this.pensums[this.selectedPensumIndex + 1];
        this.updatePensumDestino(nextPensum);
      } else {
        // If it's the last pensum, set it as the destination
        const lastPensum = this.pensums[this.pensums.length - 1];
        this.updatePensumDestino(lastPensum);
      }
    }
  }

  updatePensumDestino(pensum: Pensum): void {
    this.pensumDestinoValue = `Pensum ${pensum.anio}`;
  }
}
