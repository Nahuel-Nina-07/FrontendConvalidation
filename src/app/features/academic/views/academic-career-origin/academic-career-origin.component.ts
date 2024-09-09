import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CareerOriginService } from '../../services/career-origin.service';
import { SuintPageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'academic-career-origin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SuintPageHeaderComponent,FormsModule, ReactiveFormsModule],
  templateUrl: './academic-career-origin.component.html',
  styleUrl: './academic-career-origin.component.scss'
})
export class CareerOriginComponent implements OnInit {
  careerForm: FormGroup;
  careers: any[] = [];
  searchName: string = '';
  selectedCareer: any = null;

  constructor(private fb: FormBuilder, private careerService: CareerOriginService) {
    this.careerForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      resolutionDate: ['', Validators.required],
      state: [false],
      numberWeeks: ['', Validators.required],
      universityId: ['', Validators.required],
      employeeId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCareers();
  }

  loadCareers() {
    this.careerService.getCareers().subscribe({
      next: (response) => {
        this.careers = response;
      },
      error: (error) => {
        console.error('Error loading careers:', error);
      }
    });
  }

  onSubmit() {
    if (this.careerForm.valid) {
      let formValue = this.careerForm.value;
  
      // Si no hay ID o está vacío, asigna 0
      if (!formValue.id || formValue.id === '') {
        formValue.id = 0;
      }
  
      const isEdit = formValue.id && formValue.id !== 0;  // Verifica si es una edición
  
      if (isEdit) {
        // Si hay ID, actualiza
        this.careerService.updateCareer(formValue).subscribe({
          next: (response) => {
            console.log('Success:', response);
            this.loadCareers();
            this.selectedCareer = null;
            this.careerForm.reset();
            this.closemodal();
          },
          error: (error) => {
            console.error('Error:', error);
          }
        });
      } else {
        // Si el ID es 0 o no existe, crea
        this.careerService.createCareer(formValue).subscribe({
          next: (response) => {
            console.log('Success:', response);
            this.loadCareers();
            this.careerForm.reset();
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
    const modal = document.getElementById('create-career-modal') as HTMLInputElement;
    if (modal) {
      modal.checked = false;
    }
  }

  deleteCareer(id: number) {
    if (confirm('Are you sure you want to delete this career?')) {
      this.careerService.deleteCareer(id).subscribe({
        next: () => {
          this.loadCareers();
        },
        error: (error) => {
          console.error('Error deleting career:', error);
        }
      });
    }
  }

  editCareer(career: any) {
    this.selectedCareer = career;
    this.careerForm.patchValue(career);
  }

  openCreateModal() {
    this.careerForm.reset();
    this.selectedCareer = null;

    const modal = document.getElementById('create-career-modal') as HTMLInputElement;
    if (modal) {
      modal.checked = true;
    }
  }
}