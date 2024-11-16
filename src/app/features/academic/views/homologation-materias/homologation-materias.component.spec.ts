import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologationMateriasComponent } from './homologation-materias.component';

describe('HomologationMateriasComponent', () => {
  let component: HomologationMateriasComponent;
  let fixture: ComponentFixture<HomologationMateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomologationMateriasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomologationMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
