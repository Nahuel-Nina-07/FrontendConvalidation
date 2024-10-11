import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit, ViewChild } from '@angular/core';
import { SuintPageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { UniversityOriginService } from '../../services/university-origin.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputCustomComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { ModalFormComponent } from "../../../../shared/components/modals/modal-form/modal-form.component";
import { SuintButtonComponent } from "../../../../shared/components/suint-button/suint-button.component";
import { AcademicOriginCareerConvalidationComponent } from "../academic-origin-career-convalidation/academic-origin-career-convalidation.component";
import { CareerOriginService } from '../../services/career-origin.service';
import { ListAllComponent } from "../../../../shared/components/list-all/list-all.component";

@Component({
  selector: 'app-academic-convalidation-list',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [SvgIconComponent, SuintPageHeaderComponent, CommonModule, ReactiveFormsModule, InputCustomComponent, ModalFormComponent, SuintButtonComponent, AcademicOriginCareerConvalidationComponent, ListAllComponent],
  templateUrl: './academic-convalidation-list.component.html',
  styleUrls: ['./academic-convalidation-list.component.scss']
})
export class AcademicConvalidationListComponent implements OnInit {
  #_formBuilder = inject(FormBuilder);
  private readonly universityOriginSvc = inject(UniversityOriginService);
  private readonly careerOriginSvc = inject(CareerOriginService);

  contractGroup: FormGroup;
  cities: any[] = [];
  universities: any[] = [];
  selectedUniversityId: number | null = null;  // Nueva variable para mantener el ID de la universidad seleccionada
  careers: any[] = [];
  
  @ViewChild('modal') modal!: ModalFormComponent;


  @Input() data: any[] = [];

  // Recibe la configuración de las columnas (nombre y campo a mostrar)
  @Input() columns: { header: string, field: string }[] = [];

  
  tableColumns = [
    { header: 'Nombre', field: 'name' },
    { header: 'Ciudad', field: 'cityId' },
    { header: 'Teléfono', field: 'phone' },
    { header: 'Correo Electronico', field: 'email' }
  ];
  
  constructor() {
    this.contractGroup = this.#_formBuilder.group({
      id: new FormControl(0),
      name: new FormControl(''),
      phone: new FormControl(''),
      
      fax: new FormControl(''),
      cityId: new FormControl(''),
      email: new FormControl(''),
      observation: new FormControl(''),
      universityId: new FormControl(''),
    });
  }

  ngOnInit() {
    this.loadCities();
    this.loadUniversities();
    this.getAllCareers();  // Llamar al método para cargar las carreras
  }

  clearForm() {
    this.contractGroup.reset({
      id: 0,
      name: '',
      phone: '',
      
      fax: '',
      cityId: '',
      email: '',
      observation: '',
      universityId: this.selectedUniversityId  // Mantener el ID seleccionado
    });
  }

  openAddModal() {
    this.selectedUniversityId = null;  // Al abrir el modal para agregar, no hay ID seleccionado
    this.clearForm();
    this.modal.openModal();
  }

  delayReload() {
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  

  onUniversityChange(universityId: number) {
    // Verificamos si se seleccionó una universidad válida
    if (universityId) {
      this.selectedUniversityId = universityId; // Almacenar el ID de la universidad seleccionada
      this.getCareersByUniversity(universityId); // Llamar al método para cargar las carreras de esa universidad
    } else {
      this.selectedUniversityId = null; // Restablecemos la selección
      this.careers = []; // Limpiar las carreras anteriores
      this.getAllCareers(); // Cargar todas las carreras si no hay universidad seleccionada
    }
  }
  
  // Nuevo método para obtener todas las carreras
  getAllCareers(): void {
    this.careerOriginSvc.getCareers().subscribe({
      next: (careers) => {
        this.careers = careers; // Mostrar todas las carreras en la vista
        console.log('Todas las carreras:', careers); // También mostramos las carreras en la consola
      },
      error: (error) => {
        console.error('Error al cargar todas las carreras:', error);
      }
    });
  }

  openEditModal() {
    const selectedUniversityId = this.contractGroup.get('universityId')?.value;

    if (selectedUniversityId) {
      this.selectedUniversityId = selectedUniversityId;  // Guardar el ID seleccionado
      const selectedUniversity = this.universities.find(university => university.id === selectedUniversityId);
      
      if (selectedUniversity) {
        this.contractGroup.patchValue({
          id: selectedUniversity.id,
          name: selectedUniversity.name,
          phone: selectedUniversity.phone,
          
          fax: selectedUniversity.fax,
          cityId: selectedUniversity.cityId,
          email: selectedUniversity.email,
          observation: selectedUniversity.observation
        });
        this.modal.openModal();
      } else {
        console.log('Universidad no encontrada.');
      }
    } else {
      console.log('No se ha seleccionado ninguna universidad.');
    }
  }

  loadUniversities() {
    this.universityOriginSvc.getUniversityOrigins().subscribe({
      next: (response) => {
        this.universities = response;
      },
      error: (error) => {
        console.error('Error al cargar las universidades:', error);
      }
    });
  }

  loadCities() {
    this.universityOriginSvc.getCity().subscribe({
      next: (response) => {
        this.cities = response;
      },
      error: (error) => {
        console.error('Error al cargar las ciudades:', error);
      }
    });
  }

  getCareersByUniversity(universityId: number): void {
    this.careerOriginSvc.getCareerByUniversity(universityId).subscribe((data) => {
      this.careers = data;
      console.log('Carreras para la universidad seleccionada:', this.careers);  // Mostrar carreras en la consola
    });
  }

  register() {
    const universityData = {
      id: this.contractGroup.get('id')?.value || 0,
      name: this.contractGroup.get('name')?.value,
      phone: this.contractGroup.get('phone')?.value,
      fax: this.contractGroup.get('fax')?.value,
      cityId: this.contractGroup.get('cityId')?.value,
      email: this.contractGroup.get('email')?.value,
      observation: this.contractGroup.get('observation')?.value,
    };
    console.log('Datos a enviar:', universityData);

    if (universityData.id === 0) {
      // Crear nueva universidad
      this.universityOriginSvc.createUniversityOrigin(universityData).subscribe({
        next: () => {
          this.loadUniversities();  
        },
        error: (error) => {
          console.error('Error al crear la universidad:', error);
        }
      });
    } else {
      // Actualizar universidad existente
      this.universityOriginSvc.updateUniversityOrigin(universityData).subscribe({
        next: () => {
          this.loadUniversities();  
        },
        error: (error) => {
          console.error('Error al actualizar la universidad:', error);
        }
      });
    }
  }
}
