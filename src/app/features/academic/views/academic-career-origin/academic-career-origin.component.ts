import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CareerOriginService } from '../../services/career-origin.service';
import { SuintPageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import { UniversityOriginService } from '../../services/university-origin.service';

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
  universities: any[] = [];
  searchName: string = '';
  selectedCareer: any = null;

  constructor(
    private fb: FormBuilder, 
    private careerService: CareerOriginService,
    private universityService: UniversityOriginService
  ) 
  {
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
    this.loadUniversities();
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

  loadUniversities() {
    this.universityService.getUniversityOrigins().subscribe({
      next: (response) => {
        this.universities = response;
      },
      error: (error) => {
        console.error('Error loading universities:', error);
      }
    });
  }

  onSubmit() {
    if (this.careerForm.valid) {
      let formValue = this.careerForm.value;

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
  
  getUniversityName(universityId: number): string {
    const university = this.universities.find(u => u.id === universityId);
    return university ? university.name : 'N/A';
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