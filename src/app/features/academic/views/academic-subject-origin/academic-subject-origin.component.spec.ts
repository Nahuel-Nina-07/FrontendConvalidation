import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicSubjectOriginComponent } from './academic-subject-origin.component';

describe('AcademicSubjectOriginComponent', () => {
  let component: AcademicSubjectOriginComponent;
  let fixture: ComponentFixture<AcademicSubjectOriginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicSubjectOriginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcademicSubjectOriginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
