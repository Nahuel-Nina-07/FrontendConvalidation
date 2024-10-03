import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UniversityOriginService } from '../../services/university-origin.service';
import { CommonModule } from '@angular/common';
import { SuintPageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";

@Component({
  selector: 'app-academic-convalidation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SuintPageHeaderComponent,FormsModule, ReactiveFormsModule,],
  templateUrl: './academic-convalidation.component.html',
  styleUrl: './academic-convalidation.component.scss'
})
export class AcademicConvalidationComponent implements OnInit {
  
  universityForm: FormGroup;
  universidades: any[] = [];
  searchName: string = '';
  universidadSeleccionada: any = null; // Propiedad para almacenar la universidad seleccionada

  constructor(private fb: FormBuilder, private universityOriginService: UniversityOriginService) {
    this.universityForm = this.fb.group({
      id: [0], // El campo ID será 0 por defecto al crear
      name: ['', Validators.required],
      cityId: ['', Validators.required],
      phone: ['', Validators.required],
      fax: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      observation: [''],
      scheduleLoad: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.cargarUniversidades();
  }

  cargarUniversidades() {
    this.universityOriginService.getUniversityOrigins().subscribe({
      next: (response) => {
        this.universidades = response;
      },
      error: (error) => {
        console.error('Error al cargar universidades:', error);
      }
    });
  }

  onSubmit() {
    if (this.universityForm.valid) {
      let formValue = this.universityForm.value;

      // Si no hay ID o está vacío, asigna 0
      if (!formValue.id || formValue.id === '') {
        formValue.id = 0;
      }

      const esEdicion = formValue.id && formValue.id !== 0;  // Verifica si es una edición

      if (esEdicion) {
        // Si hay ID, actualiza
        this.universityOriginService.updateUniversityOrigin(formValue).subscribe({
          next: (response) => {
            console.log('Éxito:', response);
            this.cargarUniversidades();
            this.universidadSeleccionada = null;
            this.universityForm.reset();
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al actualizar:', error);
          }
        });
      } else {
        // Si el ID es 0 o no existe, crea
        this.universityOriginService.createUniversityOrigin(formValue).subscribe({
          next: (response) => {
            console.log('Éxito:', response);
            this.cargarUniversidades();
            this.universityForm.reset();
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al crear:', error);
          }
        });
      }
    }
  }

  cerrarModal() {
    const modal = document.getElementById('create-university-modal') as HTMLInputElement;
    if (modal) {
      modal.checked = false;
    }
  }

  eliminarUniversidad(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta universidad?')) {
      this.universityOriginService.deleteUniversityOrigin(id).subscribe({
        next: () => {
          this.cargarUniversidades();
        },
        error: (error) => {
          console.error('Error al eliminar la universidad:', error);
        }
      });
    }
  }

  buscar() {
    if (this.searchName.trim()) {
      this.universityOriginService.getUniversityByName(this.searchName).subscribe({
        next: (response) => {
          this.universidades = [response]; // Envuelve el resultado único en un array
        },
        error: (error) => {
          console.error('Error al buscar la universidad:', error);
        }
      });
    } else {
      this.cargarUniversidades();
    }
  }

  editarUniversidad(universidad: any) {
    this.universidadSeleccionada = universidad; // Almacena la universidad seleccionada
    this.universityForm.patchValue(universidad); // Rellena el formulario con los datos de la universidad
  }

  abrirModalCrear() {
    this.universityForm.reset(); // Restablece el formulario
    this.universityForm.patchValue({
      cityId: '',
      phone: '',
      fax: '',
      email: '',
      scheduleLoad: ''
    });
    const modal = document.getElementById('create-university-modal') as HTMLInputElement;
    if (modal) {
      modal.checked = true;
    }
  }
}