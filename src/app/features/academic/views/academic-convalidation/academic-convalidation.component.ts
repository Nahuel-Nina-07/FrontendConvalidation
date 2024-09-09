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
  universities: any[] = [];
  searchName: string = '';
  selectedUniversity: any = null; // Propiedad para almacenar la universidad seleccionada

  constructor(private fb: FormBuilder, private universityOriginService: UniversityOriginService) {
    this.universityForm = this.fb.group({
      id: [''], // El campo ID se mantiene en el formulario pero será vacío al crear
      name: ['', Validators.required],
      faculty: ['', Validators.required],
      country: ['', Validators.required],
      academicLevel: ['Pregrado', Validators.required],
      studyRegimen: ['Semestral', Validators.required],
      phone: ['', Validators.required],
      fax: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      observation: [''],
      scheduleLoad: ['', Validators.required],
      approvalNote: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUniversities();
  }

  loadUniversities() {
    this.universityOriginService.getUniversityOrigins().subscribe({
      next: (response) => {
        this.universities = response;
      },
      error: (error) => {
        console.error('Error loading universities:', error);
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
  
      const isEdit = formValue.id && formValue.id !== 0;  // Verifica si es una edición
  
      if (isEdit) {
        // Si hay ID, actualiza
        this.universityOriginService.updateUniversityOrigin(formValue).subscribe({
          next: (response) => {
            console.log('Success:', response);
            this.loadUniversities();
            this.selectedUniversity = null;
            this.universityForm.reset();
            this.closemodal();
          },
          error: (error) => {
            console.error('Error:', error);
          }
        });
      } else {
        // Si el ID es 0 o no existe, crea
        this.universityOriginService.createUniversityOrigin(formValue).subscribe({
          next: (response) => {
            console.log('Success:', response);
            this.loadUniversities();
            this.universityForm.reset();
            this.closemodal();
          },
          error: (error) => {
            console.error('Error:', error);
          }
        });
      }
    }
  }
  

  closemodal() {
    const modal = document.getElementById('create-university-modal') as HTMLInputElement;
    if (modal) {
      modal.checked = false;
    }
  }

  deleteUniversity(id: number) {
    if (confirm('Are you sure you want to delete this university?')) {
      this.universityOriginService.deleteUniversityOrigin(id).subscribe({
        next: () => {
          this.loadUniversities();
        },
        error: (error) => {
          console.error('Error deleting university:', error);
        }
      });
    }
  }

  search() {
    if (this.searchName.trim()) {
      this.universityOriginService.getUniversityByName(this.searchName).subscribe({
        next: (response) => {
          this.universities = [response]; // Wrap the single result in an array
        },
        error: (error) => {
          console.error('Error searching for university:', error);
        }
      });
    } else {
      this.loadUniversities();
    }
  }

  editUniversity(university: any) {
    this.selectedUniversity = university; // Store the selected university
    this.universityForm.patchValue(university); // Fill the form with the university's data
  }

  openCreateModal() {
    this.universityForm.reset(); // Reset the form
    this.universityForm.patchValue({
      academicLevel: 'Pregrado',
      studyRegimen: 'Semestral'
    });
    const modal = document.getElementById('create-university-modal') as HTMLInputElement;
    if (modal) {
      modal.checked = true;
    }
  }
}