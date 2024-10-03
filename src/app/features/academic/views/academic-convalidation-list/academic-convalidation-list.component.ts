import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SuintPageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { ContratoService } from '../../../human-resources/services/contrato.service';
import { WorkAreaService } from '../../../human-resources/services/work-area.service';
import { UniversityOriginService } from '../../services/university-origin.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputCustomComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { ModalFormComponent } from "../../../../shared/components/modals/modal-form/modal-form.component";

@Component({
  selector: 'app-academic-convalidation-list',
  standalone: true,
  imports: [SvgIconComponent, SuintPageHeaderComponent, CommonModule, ReactiveFormsModule, InputCustomComponent, ModalFormComponent],
  templateUrl: './academic-convalidation-list.component.html',
  styleUrls: ['./academic-convalidation-list.component.scss']
})
export class AcademicConvalidationListComponent implements OnInit {
  #_formBuilder = inject(FormBuilder);
  private readonly universityOriginSvc = inject(UniversityOriginService);

  contractGroup: FormGroup;
  cities: any[] = [];

  constructor() {
    this.contractGroup = this.#_formBuilder.group({
      name: new FormControl(''),
      phone: new FormControl(''),
      scheduleLoad: new FormControl(''),
      fax: new FormControl(''),
      cityId: new FormControl(''),
      email: new FormControl(''),
      observation: new FormControl(''),
    });
  }

  ngOnInit() {
    this.loadCities();
  }

  loadCities() {
    this.universityOriginSvc.getCity().subscribe({
        next: (response) => {
            this.cities = response;
            console.log('Ciudades cargadas:', this.cities);
        },
        error: (error) => {
            console.error('Error al cargar las ciudades:', error);
        }
    });
}


  register() {
    const universityData = {
      name: this.contractGroup.get('name')?.value,
      phone: this.contractGroup.get('phone')?.value,
      scheduleLoad: this.contractGroup.get('scheduleLoad')?.value,
      fax: this.contractGroup.get('fax')?.value,
      cityId: this.contractGroup.get('cityId')?.value,
      email: this.contractGroup.get('email')?.value,
      observation: this.contractGroup.get('observation')?.value,
    };

    console.log('Datos de universidad a enviar:', universityData);

    this.universityOriginSvc.createUniversityOrigin(universityData).subscribe({
      next: (response) => {
        console.log('Universidad creada con éxito:', response);
      },
      error: (error) => {
        console.error('Error al crear la universidad:', error);
      }
    });
  }
}
