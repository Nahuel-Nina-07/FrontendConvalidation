import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicConvalidationsComponent } from './academic-convalidations.component';

describe('AcademicConvalidationsComponent', () => {
  let component: AcademicConvalidationsComponent;
  let fixture: ComponentFixture<AcademicConvalidationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicConvalidationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcademicConvalidationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
