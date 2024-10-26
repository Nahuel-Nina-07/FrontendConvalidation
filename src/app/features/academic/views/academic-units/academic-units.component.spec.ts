import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicUnitsComponent } from './academic-units.component';

describe('AcademicUnitsComponent', () => {
  let component: AcademicUnitsComponent;
  let fixture: ComponentFixture<AcademicUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicUnitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcademicUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
