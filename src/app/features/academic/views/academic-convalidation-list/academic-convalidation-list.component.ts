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
  selectedUniversityId: number | null = null; 
  careers: any[] = [];
  
  filteredUniversities: any[] = [];

  @ViewChild('modal') modal!: ModalFormComponent;

  @Input() data: any[] = [];
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

      search: new FormControl('')
    });
  }

  ngOnInit() {
    this.loadCities();
    this.loadUniversities();
  }

  openAddModal() {
    this.selectedUniversityId = null;
    this.modal.openModal();
  }

  delayReload() {
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  openEditModal() {
    const selectedUniversityId = this.contractGroup.get('universityId')?.value;
    if (selectedUniversityId) {
      this.selectedUniversityId = selectedUniversityId;
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
        this.filteredUniversities = response;  // Inicialmente, todas las universidades se muestran.
      },
      error: (error) => {
        console.error('Error al cargar las universidades:', error);
      }
    });
  }


  filterUniversities() {
    const searchValue = this.contractGroup.get('search')?.value.toLowerCase();
    if (searchValue) {
      this.filteredUniversities = this.universities.filter(university =>
        university.name.toLowerCase().includes(searchValue)
      );
    } else {
      this.filteredUniversities = [...this.universities]; // Mostrar todas las universidades si no hay búsqueda
    }
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
