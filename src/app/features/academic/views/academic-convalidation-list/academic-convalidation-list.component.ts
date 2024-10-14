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

  contractGroup: FormGroup;
  cities: any[] = [];
  universities: any[] = [];
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
  
  

  ngOnInit() {
    this.loadCities();
    this.loadUniversities();
  }

  openAddModal() {
    this.modal.openModal();
    const id = this.contractGroup.get('id')?.value;
    
    this.contractGroup.reset(
      { id: id }
    );
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

  constructor() {
    this.contractGroup = this.createFormGroup();
  }

  private createFormGroup(): FormGroup {
    return this.#_formBuilder.group({
      id: new FormControl(0),
      name: new FormControl(''),
      phone: new FormControl(''),
      fax: new FormControl(''),
      cityId: new FormControl(''),
      email: new FormControl(''),
      observation: new FormControl(''),
      search: new FormControl('')
    });
  }


  private loadInitialData(): void {
    this.loadUniversities();
  }


  onSubmit() {
    if (this.contractGroup.valid) {
      const formData = this.contractGroup.value;
      console.log('Form data:', formData);
      this.universityOriginSvc.createUniversityOrigin(formData).subscribe({
        next: (response) => {
          console.log('Asignatura creada:', response);
          this.modal.closeModal();
          this.loadInitialData(); // Recargar datos
        },
        error: (err) => {
          console.error('Error al crear la asignatura', err);
        },
      });
    } else {
      console.log('El formulario es inválido');
    }
  }

  onDelete(item: any): void {
    const itemId = item.id;
    console.log('Delete item with ID:', itemId);
    this.universityOriginSvc.deleteUniversityOrigin(itemId).subscribe({
      next: (response) => {
        this.filteredUniversities = this.filteredUniversities.filter(u => u.id !== itemId);
        console.log('Item deleted successfully', response);
      },
      error: (error) => {
        console.error('Error deleting item', error);
      }
    });
  }
  

  onEdit(item: any): void {
    this.contractGroup.patchValue(item);
    this.modal.openModal();
  }
}
